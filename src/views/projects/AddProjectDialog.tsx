import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { Dialog } from '@/components/ui';
import { CreateProjectDto } from '@/@types/projects';
import { useAppDispatch, useAppSelector } from '@/store/configureStore';
import { addProject } from '@/store/project/projectActions';
import { selectProjectsLoading } from '@/store/project/projectSelectors';

interface AddProjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}

const AddProjectDialog: React.FC<AddProjectDialogProps> = ({
    isOpen,
    onClose,
    onSuccess,
    onError,
}) => {
    const dispatch = useAppDispatch();
    const isAdding = useAppSelector(selectProjectsLoading); // Use Redux loading state
    const [projectName, setProjectName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]); // Set default to today

    const handleAddProject = async () => {
        if (!projectName) {
            onError('Project name is required.');
            return;
        }

        const projectData: CreateProjectDto = { name: projectName, description, startDate };

        try {
            const resultAction = await dispatch(addProject(projectData));
            if (addProject.fulfilled.match(resultAction)) {
                toast.push(
                    <Notification title="Success" type="success">
                        Project added successfully.
                    </Notification>
                );
                onSuccess();
                setProjectName('');
                setDescription('');
                setStartDate(new Date().toISOString().split('T')[0]); // Reset to today
                onClose();
            } else {
                onError(resultAction.payload || 'Error adding project.');
            }
        } catch (error) {
            onError('An error occurred while adding the project.');
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <h5 className="mb-4">Add Project</h5>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Project Name</label>
                <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Description</label>
                <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter project description"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Start Date</label>
                <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </div>
            <div className="text-right">
                <Button variant="plain" onClick={onClose} className="ltr:mr-2">
                    Cancel
                </Button>
                <Button variant="solid" onClick={handleAddProject} disabled={isAdding}>
                    {isAdding ? 'Adding...' : 'Add Project'}
                </Button>
            </div>
        </Dialog>
    );
};

export default AddProjectDialog;
