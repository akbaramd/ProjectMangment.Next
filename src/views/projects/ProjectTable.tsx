import { useState, useEffect } from 'react';
import { Table, Card, Spinner, Pagination } from '@/components/ui'; // Import pagination component
import { useReactTable, flexRender, getCoreRowModel, ColumnDef } from '@tanstack/react-table';
import Notification from '@/components/ui/Notification';
import { ProjectDto } from '@/@types/projects';  // Assume a ProjectDto type exists
import { apiGetProjectsForTenant } from '@/services/ProjectService';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

interface ProjectsTableProps {
    columns: ColumnDef<ProjectDto>[];  // Columns for the projects table
    searchFilter: string | number;  // Client-side search filter
    reload: boolean;  // Trigger data reload
}

const ProjectsTable = ({ columns, searchFilter, reload }: ProjectsTableProps) => {
    const [projectsList, setProjectsList] = useState<ProjectDto[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10); // Default page size
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjectsList = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const response = await apiGetProjectsForTenant(pageSize, (page - 1) * pageSize, searchFilter.toString());
                setProjectsList(response.results);
                setTotalCount(response.totalCount); // Assuming API returns total count
            } catch (err: any) {
                setFetchError('Error fetching projects');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectsList();
    }, [reload, searchFilter, page]);  // Reload data when the reload, search filter, or page changes

    const table = useReactTable({
        data: projectsList,  // Use the fetched projects for table data
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <Card className="flex justify-center items-center text-center">
                <div>
                    <Spinner className="mx-auto mb-4" size="30px" />
                    <p className="font-medium">Loading projects, please wait...</p>
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
        <Card className="overflow-hidden">
            <Table className='border'>
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

            {/* Pagination component */}
            <div className="flex justify-between items-center p-4">
                <p>
                    نمایش {projectsList.length} از {totalCount} پروژه
                </p>
                <Pagination
                    currentPage={page}
                    total={totalCount}
                    pageSize={pageSize}
                    onChange={setPage}
                />
            </div>
        </Card>
    );
};

export default ProjectsTable;
