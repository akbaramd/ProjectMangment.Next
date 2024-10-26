import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/configureStore'; // Redux hooks
import Spinner from '@/components/ui/Spinner';
import Tabs from '@/components/ui/Tabs'; // Tabs component
import { HiOutlineCog, HiOutlineEye } from 'react-icons/hi'; // Icons for the tabs
import ProjectDetailsSetting from './components/ProjectDetailsSetting';
import ProjectDetailsHeader from './components/ProjectDetailsHeader';
import { Card } from '@/components/ui';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import { fetchProjectDetails, updateProject } from '@/store/project/projectActions';
import { selectProjectDetails } from '@/store/project/projectSelectors';
import { selectError, selectIsLoading } from '@/store/invitation/invitationSelectors';

const { TabNav, TabList, TabContent } = Tabs;

const ProjectDetails = () => {
    const { id } = useParams<{ id: string }>(); // Project ID from URL params
    const dispatch = useAppDispatch();
    
    // Redux states
    const projectDetails = useAppSelector(selectProjectDetails);
    const isLoading = useAppSelector(selectIsLoading);
    const error = useAppSelector(selectError);
    
    const [selectedNav, setSelectedNav] = useState('settings');
    const [isContentEdit, setIsContentEdit] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchProjectDetails(id));
        }
    }, [id, dispatch]);

    const handleEdit = (isEdit: boolean) => {
        setSelectedNav('settings');
        setIsContentEdit(isEdit);
    };

    const handleUpdate = ({
        name,
        description,
        startDate,
    }: {
        name: string;
        description: string;
        startDate: string;
    }) => {
        if (projectDetails) {
            dispatch(updateProject({ projectId: projectDetails.id, data: { name, description } }));
        }
        setIsContentEdit(false);
        setSelectedNav('settings');
        toast.push(
            <Notification title="Success" type="success">
                Project details updated successfully.
            </Notification>
        );
    };

    if (isLoading) {
        return (
            <div className="my-4 mx-auto text-center flex justify-center">
                <Spinner size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-4 mx-auto text-center flex justify-center">
                <Notification title="Error" type="danger">
                    {error}
                </Notification>
            </div>
        );
    }

    return (
        <Card>
            {projectDetails && (
                <>
                    <ProjectDetailsHeader
                        title={projectDetails.name ?? ''}
                        isContentEdit={isContentEdit}
                        onEdit={handleEdit}
                        selected={selectedNav}
                        onChange={(val) => setSelectedNav(val)}
                    />

                    {/* Tabs Section */}
                    <Tabs defaultValue="settings">
                        <TabList>
                            <TabNav value="settings" icon={<HiOutlineCog />}>
                                Settings
                            </TabNav>
                            <TabNav value="overview" icon={<HiOutlineEye />}>
                                Overview
                            </TabNav>
                        </TabList>

                        <div className="p-4">
                            <TabContent value="settings">
                                {/* Settings Content */}
                                <ProjectDetailsSetting
                                    name={projectDetails.name ?? ''}
                                    description={projectDetails.description ?? ''}
                                    startDate={projectDetails.startDate ?? ''}
                                    onUpdate={handleUpdate}
                                />
                            </TabContent>

                            <TabContent value="overview">
                                {/* Overview Content */}
                                <div>
                                    <p>
                                        Overview of the project will go here. You can display the project status, progress, and key metrics.
                                    </p>
                                </div>
                            </TabContent>
                        </div>
                    </Tabs>
                </>
            )}
        </Card>
    );
};

export default ProjectDetails;
