import { useState } from 'react';
import ProjectTable from './ProjectTable'; // Import the ProjectTable component
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { ProjectDto } from '@/@types/projects';
import AddProjectDialog from './AddProjectDialog'; // Import the AddProjectDialog component

const ProjectsPage = () => {
    const [reload, setReload] = useState(false); // Track table reload state
    const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
    const [isModifyProjectDialogOpen, setModifyProjectDialogOpen] = useState(false);
    const [isAddProjectDialogOpen, setAddProjectDialogOpen] = useState(false); // Track Add Project dialog state
    const [projectToBeRemoved, setProjectToBeRemoved] = useState<ProjectDto | null>(null); // Track project to be removed
    const [projectToModify, setProjectToModify] = useState<ProjectDto | null>(null); // Track project to modify
    const navigate = useNavigate();

    const triggerTableReload = () => {
        setReload((prev) => !prev); // Trigger table reload to refresh the data
    };

    const handleActionError = (message: string) => {
        toast.push(
            <Notification title="Error" type="danger">
                {message}
            </Notification>
        );
    };

    const handleRemoveSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                The project has been successfully removed.
            </Notification>
        );
        triggerTableReload(); // Refresh the table after removing the project
        setRemoveDialogOpen(false); // Close the remove dialog
    };

    const handleModifyProjectSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                The project has been successfully updated.
            </Notification>
        );
        triggerTableReload(); // Refresh the table after updating the project
        setModifyProjectDialogOpen(false); // Close the modify dialog
    };

    const handleAddProjectSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                The project has been successfully added.
            </Notification>
        );
        triggerTableReload(); // Refresh the table after adding a new project
        setAddProjectDialogOpen(false); // Close the add project dialog
    };

    // Define columns for the project table
    const columns: ColumnDef<ProjectDto>[] = [
        {
            accessorKey: 'name',
            id: 'name',
            header: 'عنوان',
            cell: (info) => info.getValue(),
            enableSorting: true,
        },
        {
            accessorKey: 'startDate',
            id: 'startDate',
            header: 'تاریخ شروع',
            cell: (info) => new Date(info.getValue() as string).toLocaleDateString(),
            enableSorting: true,
            meta: {
                responsive: true,
            },
        },
        {
            header: 'عملیات',
            accessorKey: 'action',
            cell: ({ row }: { row: { original: ProjectDto } }) => {
                return (
                    <div className="flex gap-2">
                        <Button
                            color="primary"
                            size="sm"
                            onClick={() => {
                                navigate(`/projects/${row.original.id}`);
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            {/* Button to open AddProjectDialog */}
            <div className="flex justify-end mb-4">
                <Button
                    color="primary"
                    onClick={() => setAddProjectDialogOpen(true)}
                    className="mr-2"
                >
                    Add Project
                </Button>
            </div>

            {/* Render ProjectTable */}
            <ProjectTable
                columns={columns}
            />

        </div>
    );
};

export default ProjectsPage;
