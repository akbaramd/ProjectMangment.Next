import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import Card from '@/components/ui/Card'
import { Link } from 'react-router-dom'
import { TbClipboardCheck, TbStarFilled } from 'react-icons/tb'
import { apiGetProjectDetails } from '@/services/ProjectService'
import { ProjectDetailsDto, SprintDto } from '@/@types/projects'
import ProgressionBar from './ProgressionBar'

const ScrumListContent = () => {
    const { id } = useParams<{ id: string }>() // Get project id from route params
    const [projectDetails, setProjectDetails] = useState<ProjectDetailsDto | null>(null)
    const [loading, setLoading] = useState(true)

    // Fetch project details based on the id from params
    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!id) return // If no id, do not attempt to fetch
            try {
                const projectDetails = await apiGetProjectDetails(id)
                setProjectDetails(projectDetails)
            } catch (error) {
                console.error('Failed to fetch project details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjectDetails()
    }, [id])

    if (loading) {
        return (
            <div className="my-4 mx-auto text-center flex justify-center">
                <Spinner size={40} />
            </div>
        )
    }

    if (!projectDetails || projectDetails.sprints?.length === 0) {
        return <p>No scrums (sprints) available.</p>
    }

    return (
        <div>
            <h5 className="mb-3">Sprints</h5>
            <div className="flex flex-col gap-4">
                {projectDetails.sprints?.map((sprint: SprintDto) => (
                    <Card key={sprint.id}>
                        <div className="grid gap-x-4 grid-cols-12">
                            <div className="my-1 sm:my-0 col-span-12 sm:col-span-3 md:col-span-3 lg:col-span-3 md:flex md:items-center">
                                <div className="flex flex-col">
                                    <h6 className="font-bold hover:text-primary">
                                        <Link to={`/sprints/${sprint.id}/boards`}>
                                            {sprint.name}
                                        </Link>
                                    </h6>
                                    <span>{sprint.startDate} - {sprint.endDate ?? 'Ongoing'}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default ScrumListContent
