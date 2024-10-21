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
    handleToggleFavorite: (projectId: string, isFavorite: boolean) => void;
}

const ProjectsTable = ({ searchFilter, reload, handleToggleFavorite }: ProjectsTableProps) => {
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
                <div className="flex flex-col gap-4">
                    {projectsList
                        .map((project) => (
                            <Card key={project.id}>
                                <div className="grid gap-x-4 grid-cols-12">
                                    <div className="my-1 sm:my-0 col-span-12 sm:col-span-2 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                                        <div className="flex flex-col">
                                            <h6 className="font-bold hover:text-primary">
                                                <a href={`/concepts/projects/project-details/${project.id}`}>
                                                    {project.name}
                                                </a>
                                            </h6>
                                            <span>{project.description}</span>
                                        </div>
                                    </div>
                                    <div className="my-1 sm:my-0 col-span-12 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                                        <UsersAvatarGroup
                                            users={project.members?.map(member => ({
                                                name: member?.member?.user.id || 'Unknown',
                                                img: member?.member?.user.phoneNumber || '', // Assuming the member has an avatarUrl field
                                            }))}
                                        />
                                    </div>
                                    <div className="my-1 sm:my-0 col-span-12 sm:col-span-1 flex md:items-center justify-end">
                                        <div
                                            className="cursor-pointer text-lg"
                                            role="button"
                                            onClick={() =>
                                                handleToggleFavorite(
                                                    project.id,
                                                    true
                                                )
                                            }
                                        >
                                            <TbStar />
                                        </div>
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
