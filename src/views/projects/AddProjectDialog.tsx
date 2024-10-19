import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { Dialog } from '@/components/ui';
import { CreateProjectDto } from '@/@types/projects'; 
import { apiAddProject } from '@/services/ProjectService';

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
    const [projectName, setProjectName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]); // Set default to today
    const [isAdding, setIsAdding] = useState(false);

    const handleAddProject = async () => {
        if (!projectName) {
            onError('Project name is required.');
            return;
        }

        setIsAdding(true);
        const projectData: CreateProjectDto = { name: projectName, description, startDate };

        try {
            await apiAddProject(projectData);
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
        } catch (error) {
            onError('Error adding project.');
        } finally {
            setIsAdding(false);
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
