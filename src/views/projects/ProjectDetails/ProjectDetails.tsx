import { useState, useEffect, lazy, Suspense } from 'react'
import Spinner from '@/components/ui/Spinner'
import ProjectDetailsNavigation from './components/ProjectDetailsNavigation'
import useResponsive from '@/utils/hooks/useResponsive'
import { useParams } from 'react-router-dom'
import { apiGetProjectDetails } from '@/services/ProjectService'
import { ProjectDetailsDto } from '@/@types/projects'
import ProjectDetailsSetting from './components/ProjectDetailsSetting'
import ProjectDetailsHeader from './components/ProjectDetailsHeader'
import { Card } from '@/components/ui'

const defatultNavValue = 'settings'
const settingsNavValue = 'settings'


const ProjectDetails = () => {
    const { id } = useParams()
    const [data, setData] = useState<ProjectDetailsDto | null>(null)
    const [loading, setLoading] = useState(true)
    const { larger } = useResponsive()

    const [selectedNav, setSelectedNav] = useState(defatultNavValue)
    const [isContentEdit, setIsContentEdit] = useState(false)

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const projectDetails = await apiGetProjectDetails(id ?? '')
                console.log(projectDetails)
                setData(projectDetails)
            } catch (error) {
                console.error('Failed to fetch project details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProjectDetails()
    }, [id])

    const handleEdit = (isEdit: boolean) => {
        setSelectedNav(settingsNavValue)
        setIsContentEdit(isEdit)
    }

    const handleContentChange = (content: string) => {
        if (data) {
            setData({ ...data })
        }
        setIsContentEdit(false)
    }

    const handleUpdate = ({
        name,
        description,
        startDate,
    }: {
        name: string
        description: string
        startDate: string
    }) => {
        if (data) {
            const updatedData = { ...data, name, description, schedule: { ...data, startDate } }
            setData(updatedData)
            setIsContentEdit(false)
            setSelectedNav(defatultNavValue)
        }
    }

    const handleNavigationChange = (val: string) => {
        setIsContentEdit(val === settingsNavValue)
        setSelectedNav(val)
    }

    if (loading) {
        return (
            <div className="my-4 mx-auto text-center flex justify-center">
                <Spinner size={40} />
            </div>
        )
    }

    return (
        <Card >
            
            {data && (
                <>
                    <ProjectDetailsHeader title={data.project.name} isContentEdit={isContentEdit} onEdit={handleEdit} selected={selectedNav} onChange={handleNavigationChange} />
                   
                    <div className="mt-6 flex gap-12">
                        {larger.xl && (
                            <ProjectDetailsNavigation
                                selected={selectedNav}
                                onChange={handleNavigationChange}
                            />
                        )}
                        <div className="w-full">
                            <Suspense
                                fallback={
                                    <div className="my-4 mx-auto text-center flex justify-center">
                                        <Spinner size={40} />
                                    </div>
                                }
                            >
                               
                                {selectedNav === 'settings' &&  <ProjectDetailsSetting
                                        name={data.project.name}
                                        description={data.project.description}
                                        startDate={data.project.startDate}
                                        onUpdate={handleUpdate}
                                    />}
                           
                            </Suspense>
                        </div>
                    </div>
                </>
            )}
        </Card  >
    )
}

export default ProjectDetails
