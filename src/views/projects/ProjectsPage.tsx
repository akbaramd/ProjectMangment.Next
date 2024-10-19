import { useState, useEffect } from 'react';

import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { ColumnDef } from '@tanstack/react-table';
import DebouncedInput from '@/views/tenant/invitations/DebouncedInput';

import { ProjectDto } from '@/@types/projects'; // Assuming this type exists
import ProjectsTable from './ProjectTable';
import { useNavigate } from 'react-router';
import AddProjectDialog from './AddProjectDialog';


const ProjectsPage = () => {
    const [searchFilter, setSearchFilter] = useState<string | number>(''); 
    const [reload, setReload] = useState(false); 
    const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
    const [isModifyProjectDialogOpen, setModifyProjectDialogOpen] = useState(false);
    const [isAddProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
    const [projectToBeRemoved, setProjectToBeRemoved] = useState<ProjectDto | null>(null);
    const [projectToModify, setProjectToModify] = useState<ProjectDto | null>(null);
    const navigate = useNavigate();
    const triggerTableReload = () => {
        setReload((prev) => !prev);
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
                Project deleted successfully.
            </Notification>
        );
        triggerTableReload();
        setRemoveDialogOpen(false);
    };

    const handleModifyProjectSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                Project updated successfully.
            </Notification>
        );
        triggerTableReload();
        setModifyProjectDialogOpen(false);
    };

    const handleAddProjectSuccess = () => {
        toast.push(
            <Notification title="Success" type="success">
                Project added successfully.
            </Notification>
        );
        triggerTableReload();
        setAddProjectDialogOpen(false);
    };

    const projectColumns: ColumnDef<ProjectDto>[] = [
        { header: 'Project Name', accessorKey: 'name' },
        { header: 'Description', accessorKey: 'description' },
        {
            header: 'Actions',
            accessorKey: 'action',
            cell: ({ row }: { row: { original: ProjectDto } }) => (
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        size="sm"
                        onClick={() => {
                            navigate(`/projects/${row.original.id}`);
                            
                        }}
                    >
                        Manage
                    </Button>
                   
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex gap-4 justify-between items-center mb-4">
                <DebouncedInput
                    className="border-gray-200 bg-white focus:bg-white"
                    value={searchFilter}
                    onChange={(value) => setSearchFilter(value)}
                    placeholder="Search projects..."
                />
                <Button
                    color="primary"
                    size="sm"
                    onClick={() => setAddProjectDialogOpen(true)}
                >
                    Add Project
                </Button>
            </div>

            <ProjectsTable
                columns={projectColumns}
                searchFilter={searchFilter}
                reload={reload}
            />

        

            <AddProjectDialog
                isOpen={isAddProjectDialogOpen}
                onClose={() => setAddProjectDialogOpen(false)}
                onSuccess={handleAddProjectSuccess}
                onError={handleActionError}
            />
        </div>
    );
};

export default ProjectsPage;
