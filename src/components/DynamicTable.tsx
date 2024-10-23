import { useState } from 'react';
import { Table, Card, Spinner, Input } from '@/components/ui';
import {
    useReactTable,
    flexRender,
    getCoreRowModel,
    ColumnDef,
    SortingState,
    OnChangeFn,
} from '@tanstack/react-table';
import Notification from '@/components/ui/Notification';
import Pagination from '@/components/ui/Pagination';
import { FaChevronDown } from 'react-icons/fa';

const { Tr, Th, Td, THead, TBody } = Table;

interface DynamicTableProps<TData> {
    title: string;
    columns: ColumnDef<TData>[];
    data: TData[];
    totalRecords: number;
    currentPage: number;
    rowsPerPage: number;
    isLoading: boolean;
    fetchError: string | null;
    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
    onPaginationChange: (page: number) => void;
    onFilterChange: (filter: string) => void;
    sortableColumns?: Array<{ id: string; label: string }>;
    additionalElements?: React.ReactNode;
    searchPlaceholder?: string;
    className?: string;
}

function DynamicTable<TData>({
    title,
    columns,
    data,
    totalRecords,
    currentPage,
    rowsPerPage,
    isLoading,
    fetchError,
    sorting,
    onSortingChange,
    onPaginationChange,
    onFilterChange,
    sortableColumns = [],
    additionalElements,
    searchPlaceholder = 'Search...',
    className = '',
}: DynamicTableProps<TData>) {
    const [searchFilter, setSearchFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    const totalPages = Math.ceil(totalRecords / rowsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchFilter(value);
        onFilterChange(value);
    };

    if (isLoading) {
        return (
            <Card className="flex justify-center items-center text-center">
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
            bodyClass="p-0"
            className={`overflow-hidden ${className}`}
            header={{
                content: (
                    <div className="flex items-center justify-between p-4">
                        {/* Title on the left */}
                        <h2 className="text-lg font-semibold">{title}</h2>

                        {/* Search input, sorting controls, and additional elements on the right */}
                        <div className="flex items-center space-x-2 gap-2">
                            {additionalElements}

                            <Input
                                value={searchFilter}
                                onChange={handleSearchChange}
                                placeholder={searchPlaceholder}
                                className="max-w-[260px]"
                            />
                        </div>
                    </div>
                ),
            }}
            footer={{
                content: (
                    <div className="flex items-center justify-between p-4">
                        <span>
                            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                        </span>
                        <Pagination
                            pageSize={rowsPerPage}
                            currentPage={currentPage}
                            total={totalRecords}
                            onChange={onPaginationChange}
                        />
                    </div>
                ),
            }}
        >
            {/* Table */}
            <Table>
                <THead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
                                        <div
                                            className={
                                                header.column.getCanSort()
                                                    ? 'cursor-pointer flex items-center justify-between'
                                                    : ''
                                            }
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getIsSorted() && (
                                                <span className="ml-1">
                                                    {header.column.getIsSorted() === 'desc'
                                                        ? <FaChevronDown/>
                                                        : <FaChevronUp/>}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {data.length === 0 ? (
                        <Tr>
                            <Td colSpan={columns.length} className="text-center py-4">
                                No records found.
                            </Td>
                        </Tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <Tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id} className="px-4 py-2 text-sm text-gray-700">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    )}
                </TBody>
            </Table>
        </Card>
    );
}

export default DynamicTable;
