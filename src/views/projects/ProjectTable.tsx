import { useState, useEffect } from 'react';
import { Table, Card, Spinner } from '@/components/ui';
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
    const [filteredProjects, setFilteredProjects] = useState<ProjectDto[]>([]);  // Client-side filtering
    const [isLoading, setIsLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjectsList = async () => {
            setIsLoading(true);
            setFetchError(null);
            try {
                const response = await apiGetProjectsForTenant();  // Fetch the list of projects
                setProjectsList(response);
                setFilteredProjects(response);  // Initially show all projects
            } catch (err: any) {
                setFetchError('Error fetching projects');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectsList();
    }, [reload]);  // Reload data when the reload prop changes

    useEffect(() => {
        // Apply client-side filter based on searchFilter
        const filtered = projectsList.filter(project => {
            const search = searchFilter.toString().toLowerCase();
            return (
                project.name?.toLowerCase().includes(search) ||  // Filter by project name
                project.description?.toLowerCase().includes(search)  // Filter by project description
            );
        });
        setFilteredProjects(filtered);
    }, [searchFilter, projectsList]);

    const table = useReactTable({
        data: filteredProjects,  // Use the filtered projects for table data
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

export default ProjectsTable;
