import { useMemo, useState, useEffect, useCallback } from 'react';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import Select from '@/components/ui/Select';
import Tag from '@/components/ui/Tag';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage';
import { useThemeStore } from '@/store/themeStore';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    FilterFn,
    SortingState,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import type { InputHTMLAttributes } from 'react';
import { Card, Pagination } from '@/components/ui';
import { Invitation, PaginationParams, SendInvitationRequest } from '@/@types/invitations';
import {
    apiGetInvitations,
    apiSendInvitation,
    apiCancelInvitation,
} from '@/services/InvitationService';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!isTyping) {
            setValue(initialValue);
        }
    }, [initialValue, isTyping]);

    useEffect(() => {
        if (isTyping) {
            const timeout = setTimeout(() => {
                onChange(value);
                setIsTyping(false);
            }, debounce);

            return () => clearTimeout(timeout);
        }
    }, [value, debounce, onChange, isTyping]);

    const handleInputChange = (e) => {
        setValue(e.target.value);
        setIsTyping(true);
    };

    return (
        <Input
            {...props}
            value={value}
            onChange={handleInputChange}
        />
    );
}

const fuzzyFilter: FilterFn<Invitation> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
        itemRank,
    });
    return itemRank.passed;
};

const InvitationPage = () => {
    const [message, setMessage] = useTimeOutMessage();
    const mode = useThemeStore((state) => state.mode);

    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [totalCount, setTotalCount] = useState(0);

    // State for Send Invitation
    const [dialogIsOpen, setIsOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [expirationDuration, setExpirationDuration] = useState(null);
    const [sendingInvitation, setSendingInvitation] = useState(false);

    // State for Canceling Invitation
    const [cancelingInvitationId, setCancelingInvitationId] = useState<string | null>(null);

    // State for Cancel Confirmation Dialog
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [cancelPhoneNumber, setCancelPhoneNumber] = useState('');
    const [invitationToCancel, setInvitationToCancel] = useState<Invitation | null>(null);

    // Validation variables
    const isInputNonEmpty = cancelPhoneNumber.length > 0;
    const isPhoneNumberMatch = cancelPhoneNumber === invitationToCancel?.phoneNumber;

    const expirationOptions = [
        { value: '1.00:00:00', label: '1 day' },
        { value: '3.00:00:00', label: '3 days' },
        { value: '7.00:00:00', label: '1 week' },
    ];

    // Handle cancel invitation
    const handleCancelInvitation = useCallback((invitation: Invitation) => {
        // Open the confirmation dialog
        setCancelDialogOpen(true);
        setInvitationToCancel(invitation);
        setCancelPhoneNumber('');
    }, []);

    const confirmCancelInvitation = async () => {
        if (!invitationToCancel) {
            return;
        }
        setCancelingInvitationId(invitationToCancel.id);
        try {
            await apiCancelInvitation(invitationToCancel.id);
            // Close the dialog
            setCancelDialogOpen(false);
            setInvitationToCancel(null);
            // Show success notification
            toast.push(
                <Notification title="Success" type="success">
                    Invitation cancelled successfully.
                </Notification>
            );
            // Refresh the invitations
            fetchInvitations();
        } catch (error) {
            console.error('Error canceling invitation:', error);
            toast.push(
                <Notification title="Error" type="danger">
                    Error canceling invitation.
                </Notification>
            );
        } finally {
            setCancelingInvitationId(null);
        }
    };

    const columns = useMemo<ColumnDef<Invitation>[]>(
        () => [
            { header: 'Phone Number', accessorKey: 'phoneNumber' },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: ({ getValue }) =>
                    new Date(getValue<string>()).toLocaleString(),
            },
            {
                header: 'Expiration Date',
                accessorKey: 'expirationDate',
                cell: ({ getValue }) =>
                    new Date(getValue<string>()).toLocaleString(),
            },
            {
                header: 'Status',
                id: 'status',
                cell: ({ row }) => {
                    const { isAccepted, isCanceled } = row.original;
                    let status = 'Pending';
                    let color = 'bg-yellow-100 text-yellow-800';
                    if (isAccepted) {
                        status = 'Accepted';
                        color = 'bg-green-100 text-green-800';
                    } else if (isCanceled) {
                        status = 'Rejected';
                        color = 'bg-red-100 text-red-800';
                    }
                    return <Tag className={`${color} px-2 py-1 rounded`}>{status}</Tag>;
                },
            },
            {
                header: 'Action',
                id: 'action',
                cell: ({ row }) => {
                    const invitation = row.original;
                    const { id, isAccepted, isCanceled } = invitation;
                    if (!isAccepted && !isCanceled) {
                        // Pending invitation, show Cancel button
                        return (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleCancelInvitation(invitation)}
                                disabled={cancelingInvitationId === id}
                            >
                                {cancelingInvitationId === id ? 'Canceling...' : 'Cancel'}
                            </Button>
                        );
                    }
                    return null;
                },
            },
        ],
        [handleCancelInvitation, cancelingInvitationId]
    );

    const fetchInvitations = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const paginationParams: PaginationParams = {
                pageNumber: pageIndex + 1, // Adjusted to 1-based index for the server
                pageSize,
                search: globalFilter,
                sortBy: sorting[0]?.id,
                sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
            };

            const response = await apiGetInvitations(paginationParams);

            setInvitations(response.items);
            setTotalCount(response.totalCount);
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                err.message ||
                'Error fetching invitations'
            );
        } finally {
            setLoading(false);
        }
    }, [pageIndex, pageSize, globalFilter, sorting]);

    useEffect(() => {
        fetchInvitations();
    }, [fetchInvitations]);

    const handleSearchChange = (value: string | number) => {
        setGlobalFilter(String(value));
        setPageIndex(0); // Reset to first page when search changes
    };

    // Dialog functions for sending invitation
    const openDialog = () => {
        setIsOpen(true);
    };

    const onDialogClose = () => {
        setIsOpen(false);
        setPhoneNumber('');
        setExpirationDuration(null);
    };

    const onDialogOk = async () => {
        if (!phoneNumber) {
            toast.push(
                <Notification title="Error" type="danger">
                    Please enter a phone number.
                </Notification>
            );
            return;
        }

        if (!expirationDuration) {
            toast.push(
                <Notification title="Error" type="danger">
                    Please select an expiration duration.
                </Notification>
            );
            return;
        }

        setSendingInvitation(true);
        const data: SendInvitationRequest = {
            phoneNumber,
            expirationDuration,
        };
        try {
            await apiSendInvitation(data);
            setIsOpen(false);
            setPhoneNumber('');
            setExpirationDuration(null);
            // Show success notification
            toast.push(
                <Notification title="Success" type="success">
                    Invitation sent successfully.
                </Notification>
            );
            fetchInvitations();
        } catch (error) {
            console.error('Error sending invitation:', error);
            toast.push(
                <Notification title="Error" type="danger">
                    Error sending invitation.
                </Notification>
            );
        } finally {
            setSendingInvitation(false);
        }
    };

    const table = useReactTable({
        data: invitations,
        columns,
        pageCount: Math.ceil(totalCount / pageSize),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
            globalFilter,
            sorting,
        },
        onPaginationChange: ({ pageIndex: newPageIndex }) => {
            setPageIndex(newPageIndex);
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        globalFilterFn: fuzzyFilter,
        debugTable: true,
    });

    return (
        <div>
            {error && (
                <Notification title="Error" type="danger">
                    {error}
                </Notification>
            )}

            <div className="flex gap-4 justify-between items-center mb-4">
                <DebouncedInput
                    className="border-gray-200 bg-white"
                    value={globalFilter ?? ''}
                    onChange={handleSearchChange}
                    placeholder="Search invitations..."
                />
                <Button variant="solid" onClick={openDialog}>
                    Send Invitation
                </Button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <Card
                    className="overflow-hidden"
                    footer={{
                        className: 'bg-gray-100',
                        content: (
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <span>
                                        Page{' '}
                                        <strong>
                                            {pageIndex + 1} of {table.getPageCount()}
                                        </strong>
                                    </span>
                                </div>
                                <div>
                                    <Pagination
                                        pageSize={pageSize}
                                        currentPage={pageIndex + 1} // 1-based index for Pagination component
                                        total={totalCount}
                                        onChange={(page) => setPageIndex(page - 1)} // Adjust for zero-based index
                                    />
                                </div>
                            </div>
                        ),
                    }}
                >
                    <Table>
                        <THead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <Th key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    <Sorter sort={header.column.getIsSorted()} />
                                                </div>
                                            )}
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </THead>
                        <TBody>
                            {table.getRowModel().rows.map((row) => (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    ))}
                                </Tr>
                            ))}
                        </TBody>
                    </Table>
                </Card>
            )}

            {/* Dialog for sending invitation */}
            <Dialog
                isOpen={dialogIsOpen}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <h5 className="mb-4">Send Invitation</h5>
                <div className="mb-4">
                    <label className="block mb-1">Phone Number:</label>
                    <Input
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Expiration Duration:</label>
                    <Select
                        placeholder="Please Select"
                        options={expirationOptions}
                        value={expirationOptions.find(
                            (option) => option.value === expirationDuration
                        )}
                        onChange={(option) => setExpirationDuration(option.value)}
                    />
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={onDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={onDialogOk}
                        disabled={sendingInvitation}
                    >
                        {sendingInvitation ? 'Sending...' : 'Send'}
                    </Button>
                </div>
            </Dialog>

            {/* Confirmation Dialog for cancelling invitation */}
            <Dialog
                isOpen={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
                onRequestClose={() => setCancelDialogOpen(false)}
            >
                <h5 className="mb-4">Cancel Invitation</h5>
                <p className="mb-4">
                    Please enter the phone number associated with this invitation to
                    confirm cancellation.
                </p>
                <pre className="bg-red-100 text-red-700 p-2 rounded mb-4">
                    {invitationToCancel?.phoneNumber}
                </pre>
                <div className="m-4">
                    <label className="block mb-1">Phone Number:</label>
                    <Input
                        value={cancelPhoneNumber}
                        onChange={(e) => setCancelPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        className={`${
                            isInputNonEmpty
                                ? isPhoneNumberMatch
                                    ? 'border-teal-500 focus:border-teal-500 focus:ring-teal-500'
                                    : 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                : ''
                        }`}
                    />
                </div>
                <div className="text-right mt-6">
                    <Button
                        className="ltr:mr-2 rtl:ml-2"
                        variant="plain"
                        onClick={() => setCancelDialogOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        onClick={confirmCancelInvitation}
                        disabled={
                            !isPhoneNumberMatch || cancelingInvitationId === invitationToCancel?.id
                        }
                    >
                        {cancelingInvitationId === invitationToCancel?.id
                            ? 'Cancelling...'
                            : 'Confirm'}
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};

export default InvitationPage;
