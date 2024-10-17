import { useMemo, useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage';
import { useThemeStore } from '@/store/themeStore';
import { apiGetInvitations } from '@/services/InvitationService';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    FilterFn,
    ColumnFiltersState,
    SortingState,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';

import type { InputHTMLAttributes } from 'react';
import { Invitation, PaginationParams } from '@/@types/invitations';
import { Card } from '@/components/ui';

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

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [value, debounce, onChange]);

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <span className="mr-2">Search:</span>
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    );
}

const fuzzyFilter: FilterFn<Invitation> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
        itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

const InvitationPage = () => {
    // State for messages and theme
    const [message, setMessage] = useTimeOutMessage();
    const mode = useThemeStore((state) => state.mode);

    // State for invitation data and UI states
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination and search state
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pageIndex, setPageIndex] = useState(0); // Page index starts from 0
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const columns = useMemo<ColumnDef<Invitation>[]>(
        () => [
            { header: 'Phone Number', accessorKey: 'phoneNumber' },
            {
                header: 'Created At',
                accessorKey: 'createdAt',
                cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
            },
            {
                header: 'Is Accepted',
                accessorKey: 'isAccepted',
                cell: ({ getValue }) => (getValue<boolean>() ? 'Yes' : 'No'),
            },
            {
                header: 'Is Canceled',
                accessorKey: 'isCanceled',
                cell: ({ getValue }) => (getValue<boolean>() ? 'Yes' : 'No'),
            },
            {
                header: 'Expiration Date',
                accessorKey: 'expirationDate',
                cell: ({ getValue }) => new Date(getValue<string>()).toLocaleString(),
            },
            // Add more columns as needed
        ],
        []
    );

    const table = useReactTable({
        data: invitations,
        columns,
        pageCount: Math.ceil(totalCount / pageSize),
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
            globalFilter,
            sorting,
        },
        manualPagination: true, // Enable server-side pagination
        manualSorting: true, // Enable server-side sorting
        manualFiltering: true, // Enable server-side filtering
        onPaginationChange: (updater) => {
            const next = typeof updater === 'function' ? updater(table.getState().pagination) : updater;
            setPageIndex(next.pageIndex);
            setPageSize(next.pageSize);
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

    useEffect(() => {
        const fetchInvitations = async () => {
            setLoading(true);
            setError(null);

            try {
                const paginationParams: PaginationParams = {
                    pageNumber: pageIndex + 1, // Convert 0-based index to 1-based page number
                    pageSize,
                    search: globalFilter,
                    sortBy: sorting[0]?.id,
                    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
                };

                const response = await apiGetInvitations(paginationParams);

                setInvitations(response.items);
                setTotalCount(response.totalCount);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Error fetching invitations');
            } finally {
                setLoading(false);
            }
        };

        fetchInvitations();
    }, [pageIndex, pageSize, globalFilter, sorting]);

    // Handle search input change
    const handleSearchChange = (value: string | number) => {
        setGlobalFilter(String(value));
        setPageIndex(0); // Reset to first page
    };

    return (
        <div>
            {/* Display error message if any */}
            {error && <div style={{ color: 'red' }}>Error: {error}</div>}

            {/* Search Input */}
            <DebouncedInput
                value={globalFilter ?? ''}
                onChange={handleSearchChange}
                placeholder="Search invitations..."
            />

            {/* Display loading indicator or table */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Card footer={{
                    className: 'bg-gray-100',
                    content: <div className="flex items-center justify-between mt-4">
                        <div>
                            <span>
                                Page{' '}
                                <strong>
                                    {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                                </strong>
                            </span>
                        </div>
                        <div>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                }}>
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
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
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
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>

                </Card>
            )}
        </div>
    );
};

export default InvitationPage;
