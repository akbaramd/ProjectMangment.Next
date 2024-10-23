import React, { useEffect, useState } from 'react';
import { ColumnDef, SortingState, OnChangeFn } from '@tanstack/react-table';
import { ProjectDto } from '@/@types/projects';
import DynamicTable from '@/components/DynamicTable';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/configureStore';
import { setCurrentPage, setSearchFilter, setSorting } from '@/store/project/projectSlice';
import { fetchProjects } from '@/store/project/projectActions';
import {
    selectProjects,
    selectProjectsLoading,
    selectProjectsError,
    selectProjectsCurrentPage,
    selectProjectsRowsPerPage,
    selectProjectsSearchFilter,
    selectProjectsSortField,
    selectProjectsSortOrder,
    selectProjectsTotalRecords,
} from '@/store/project/projectSelectors';
import AddProjectDialog from './AddProjectDialog'; // Import the AddProjectDialog component
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';

interface ProjectTableProps {
    columns: ColumnDef<ProjectDto>[];
}

const ProjectTable = ({ columns }: ProjectTableProps) => {
    const dispatch = useAppDispatch();

    // Redux selectors for project data
    const data = useAppSelector(selectProjects);
    const isLoading = useAppSelector(selectProjectsLoading);
    const error = useAppSelector(selectProjectsError);
    const totalRecords = useAppSelector(selectProjectsTotalRecords);
    const currentPage = useAppSelector(selectProjectsCurrentPage);
    const rowsPerPage = useAppSelector(selectProjectsRowsPerPage);
    const sortField = useAppSelector(selectProjectsSortField);
    const sortOrder = useAppSelector(selectProjectsSortOrder);
    const searchFilter = useAppSelector(selectProjectsSearchFilter);

    // Local state for managing Add Project Dialog
    const [isAddProjectDialogOpen, setIsAddProjectDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchProjects({ take: rowsPerPage, skip: (currentPage - 1) * rowsPerPage, search: searchFilter }));
    }, [dispatch, currentPage, searchFilter, sortField, sortOrder, rowsPerPage]);

    const handlePaginationChange = (page: number) => {
        dispatch(setCurrentPage(page));
    };

    const handleFilterChange = (filter: string) => {
        dispatch(setSearchFilter(filter));
    };

    const handleSortFieldChange = (field: string, order: 'asc' | 'desc') => {
        dispatch(
          setSorting({
            field,
            order,
          })
        );
    }
    const handleAddProjectSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                Project added successfully.
            </Notification>
        );
        setIsAddProjectDialogOpen(false); // Close dialog on success
        dispatch(fetchProjects({ take: rowsPerPage, skip: (currentPage - 1) * rowsPerPage, search: searchFilter })); // Refresh table
    };

    const handleAddProjectError = (message: string) => {
        toast.push(
            <Notification title="Error" type="danger">
                {message}
            </Notification>
        );
    };

    // Additional elements (Add Project button)
    const additionalElements = (
        <Button color="primary" onClick={() => setIsAddProjectDialogOpen(true)} className="mr-2">
            Add Project
        </Button>
    );
    const handleSortingChange: OnChangeFn<SortingState> = (updaterOrValue) => {
        if (Array.isArray(updaterOrValue) && updaterOrValue.length > 0) {
          dispatch(
            setSorting({
              field: updaterOrValue[0].id,
              order: updaterOrValue[0].desc ? 'desc' : 'asc',
            })
          );
        }
      };
    return (
        <div>
            <DynamicTable<ProjectDto>
                title="Project List"
                columns={columns}
                data={data}
                totalRecords={totalRecords}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                isLoading={isLoading}
                fetchError={error}
                onSortFieldChange={handleSortFieldChange}
                sorting={[
                    {
                        id: sortField,
                        desc: sortOrder === 'desc',
                    },
                ]}
                onSortingChange={handleSortingChange}
                onPaginationChange={handlePaginationChange}
                onFilterChange={handleFilterChange}
                searchPlaceholder="Search Projects..."
                additionalElements={additionalElements} // Add button inside the table
            />

            <AddProjectDialog
                isOpen={isAddProjectDialogOpen}
                onClose={() => setIsAddProjectDialogOpen(false)}
                onSuccess={handleAddProjectSuccess}
                onError={handleAddProjectError}
            />
        </div>
    );
};

export default ProjectTable;

