import { useState } from 'react';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { ColumnDef } from '@tanstack/react-table';
import DebouncedInput from '@/views/tenant/invitations/DebouncedInput';

import { ProjectDto } from '@/@types/projects'; 
import ProjectsTable from './ProjectTable';
import { useNavigate } from 'react-router';
import AddProjectDialog from './AddProjectDialog';

const ProjectsPage = () => {
    const [searchFilter, setSearchFilter] = useState<string | number>(''); 
    const [reload, setReload] = useState(false); 
    const [isAddProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
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
        { header: 'عنوان', accessorKey: 'name' },
        { header: 'تاریخ شروع', accessorKey: 'startDate' 
            ,cell: ({ row }: { row: { original: ProjectDto } }) => {
                return new Date(row.original.startDate).toLocaleString();
            },
        },
        {
            header: 'عملیات',
            accessorKey: 'action',
            cell: ({ row }: { row: { original: ProjectDto } }) => (
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        size="sm"
                        onClick={() => {
                            navigate(`/projects/${row.original.id}/sprints`);
                        }}
                    >
                        مدیریت
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <h5 className='mb-3'>پروژه ها</h5>
            <div className="flex gap-4 justify-between items-center mb-4">
                <DebouncedInput
                    className="border-gray-200 bg-white focus:bg-white"
                    value={searchFilter}
                    onChange={(value) => setSearchFilter(value)}
                    placeholder="جستجوی پروژه..."
                />
                <Button
                    color="primary"
                    size="sm"
                    onClick={() => setAddProjectDialogOpen(true)}
                >
                    افزودن پروژه
                </Button>
            </div>

            <ProjectsTable
    
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
