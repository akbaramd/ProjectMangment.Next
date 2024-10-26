import { useState, useEffect } from 'react';
import { Card, Spinner, Pagination } from '@/components/ui'; // Import pagination component
import Notification from '@/components/ui/Notification';
import { ProjectDto } from '@/@types/projects';  // Assume a ProjectDto type exists
import { apiGetProjectsForTenant } from '@/services/ProjectService';
import { TbStarFilled, TbStar, TbClipboardCheck } from 'react-icons/tb';
import { UsersAvatarGroup } from '@/components/shared';

interface ProjectsTableProps {
    searchFilter: string | number;  // Client-side search filter
    reload: boolean;  // Trigger data reload
    
}

const ProjectsTable = ({ searchFilter, reload }: ProjectsTableProps) => {
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
        <div>
            <div className="mt-8">
                <h5 className="mb-3">Other Projects</h5>
                <div className="grid grid-cols-2 gap-4"> {/* Changed grid to 6 columns */}
                    {projectsList
                        .map((project) => (
                            <Card key={project.id}>
                                <div className="flex justify-between"> {/* Updated to 6 columns */}
                                    <div className="my-1 sm:my-0 col-span-6 sm:col-span-2 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                                        <div className="flex flex-col">
                                            <h6 className="font-bold hover:text-primary">
                                                <a href={`/projects/${project.id}/sprints`}>
                                                    {project.name}
                                                </a>
                                            </h6>
                                            <span>{project.description}</span>
                                        </div>
                                    </div>
                                    <div className="my-1 sm:my-0 col-span-6 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                                        <UsersAvatarGroup
                                            users={project.members?.map(member => ({
                                                name: member?.tenantMember?.user?.fullName || 'Unknown',
                                                img: member?.tenantMember?.user?.phoneNumber || '', // Assuming the member has an avatarUrl field
                                            }))}
                                        />
                                    </div>
                                    
                                </div>
                            </Card>
                        ))}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4">
                <p>
                    Showing {projectsList.length} of {totalCount} projects
                </p>
                <Pagination
                    currentPage={page}
                    total={totalCount}
                    pageSize={pageSize}
                    onChange={setPage}
                />
            </div>
        </div>
    );
};

export default ProjectsTable;
