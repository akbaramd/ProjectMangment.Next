import { useState, useEffect, useCallback } from 'react';
import { Table, Pagination, Card, Spinner } from '@/components/ui'
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, ColumnDef } from '@tanstack/react-table';
import { Invitation, PaginationParams } from '@/@types/invitations';
import { apiGetInvitations } from '@/services/InvitationService';
import Notification from '@/components/ui/Notification';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

interface InvitationTableProps {
    columns: ColumnDef<Invitation>[];
    searchFilter: string | number; // Add searchFilter as a prop
    reload: boolean; // Prop to control when to reload the data
}

const InvitationTable = ({ columns, searchFilter, reload }: InvitationTableProps) => {
    const [invitationsList, setInvitationsList] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRecords, setTotalRecords] = useState(0);

    const fetchInvitationsList = useCallback(async () => {
        setIsLoading(true);
        setFetchError(null);

        try {
            const paginationParams: PaginationParams = {
                pageNumber: currentPage + 1, // Adjusting for 1-based index
                pageSize: rowsPerPage,
                search: searchFilter.toString(), // Use searchFilter for filtering
            };

            const response = await apiGetInvitations(paginationParams);
            setInvitationsList(response.items);
            setTotalRecords(response.totalCount);
        } catch (err: any) {
            setFetchError('Error fetching invitations');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, rowsPerPage, searchFilter]); // Add searchFilter as a dependency

    useEffect(() => {
        fetchInvitationsList();
    }, [fetchInvitationsList, reload]); // Reload data whenever reload changes

    const table = useReactTable({
        data: invitationsList,
        columns,
        pageCount: Math.ceil(totalRecords / rowsPerPage),
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination: {
                pageIndex: currentPage,
                pageSize: rowsPerPage,
            },
        },
    });

// Inside your component's render
    if (isLoading) {
        return (
            <Card className="flex justify-center items-center  text-center">
                <div>
                    <Spinner className="mx-auto mb-4" size="30px" />
                    <p className="font-medium">Loading data, please wait...</p>
                </div>
            </Card>
        );
    }

    if (fetchError) {
        return (
            <Notification title="Error" type="danger">
                {fetchError}
            </Notification>
        );
    }

    return (
        <Card
            className="overflow-hidden"
            footer={{
                content: (
                    <div className="flex items-center justify-between ">
                        <span>
                            Page <strong>{currentPage + 1} of {table.getPageCount()}</strong>
                        </span>
                        <Pagination
                            pageSize={rowsPerPage}
                            currentPage={currentPage + 1}
                            total={totalRecords}
                            onChange={(page) => setCurrentPage(page - 1)}
                        />
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
                                            className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                                            onClick={header.column.getToggleSortingHandler()}
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
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </Card>
    );
};

export default InvitationTable;
