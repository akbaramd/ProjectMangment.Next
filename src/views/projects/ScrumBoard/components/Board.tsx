import { lazy, Suspense, useEffect, useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Spinner from '@/components/ui/Spinner'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import reorderDragable from '@/utils/reorderDragable'
import BoardColumn from './BoardColumn'
import ScrumBoardHeader from './ScrumBoardHeader'
import { useScrumBoardStore } from '../store/scrumBoardStore'
import sleep from '@/utils/sleep'
import reoderArray from '@/utils/reoderArray'

import {
    Droppable,
    DragDropContext,
    DraggableChildrenFn,
} from '@hello-pangea/dnd'
import { apiGetBoardDetails } from '@/services/BoardService'
import {  apiGetTenantMembers } from '@/services/TenantService'

import type { DropResult } from '@hello-pangea/dnd'
import { BoardDto } from '@/@types/projects'
import { TenantMember } from '@/@types/tenant'
import { Member, Ticket } from '../types'
import { useParams } from 'react-router-dom'

// Function to transform TenantMember to Member
const transformToMember = (tenantMember: TenantMember): Member => ({
    id: tenantMember.userId, // Ensure this field exists in TenantMember
    name: tenantMember.user.fullName, // Ensure this field exists in TenantMember
    email: tenantMember.user.email, // Ensure this field exists in TenantMember
    img: tenantMember.user.id, // Ensure this field exists in TenantMember
})

export type BoardProps = {
    containerHeight?: boolean
    useClone?: DraggableChildrenFn
    isCombineEnabled?: boolean
    withScrollableColumns?: boolean
}

const TicketContent = lazy(() => import('./TicketContent'))

const Board = (props: BoardProps) => {
    const {
        columns,
        ordered,
        updateOrdered,
        updateColumns,
        updateBoardMembers,
        updateAllMembers,
        closeDialog,
        resetView,
        dialogView,
        dialogOpen,
    } = useScrumBoardStore()
    const { id } = useParams()// Replace with the actual sprint ID
    const { containerHeight, useClone, isCombineEnabled, withScrollableColumns } = props

    // Use React useState to manage board and members data
    const [loadingBoards, setLoadingBoards] = useState<boolean>(true)
    const [loadingMembers, setLoadingMembers] = useState<boolean>(true)

    useEffect(() => {
        // Function to fetch boards for the sprint
        const fetchBoards = async () => {
            try {
        
                const boards: BoardDto = await apiGetBoardDetails(id || "")
                const transformedColumns = transformBoardsToColumns(boards);
                updateOrdered(Object.keys(transformedColumns));
                updateColumns(transformedColumns);
            } catch (error) {
                console.error('Error fetching boards:', error)
            } finally {
                setLoadingBoards(false)
            }
        }
        const transformBoardsToColumns = (boards: BoardDto): Record<string, Ticket[]> => {
            const columns: Record<string, Ticket[]> = {};
        
            boards.columns?.forEach((column) => {
                columns[column.name ?? ''] = column.tasks?.map((task) => ({
                    id: task.id,
                    title: task.title,
                    description: task.description ?? '', // Default to an empty string if null or undefined
                    status: task.status,
                    order: task.order,
                    name: task.title ?? '', // Assuming `name` in Ticket corresponds to `title` in task
                    cover: task.title || '', // Ensure this is a string, default to an empty string if null
                    dueDate: 0, // Ensure this exists in your task object
                    members: [], // Ensure this exists in your task object if it's part of `Ticket`
                })) ?? []; // If no tasks, use an empty array
            });
        
            return columns;
        };
        
        // Function to fetch tenant members
        const fetchMembers = async () => {
            try {
                const members = await apiGetTenantMembers(100, 0)
                const transformedMembers = members.results.map(transformToMember)
                updateBoardMembers(transformedMembers)
                updateAllMembers(transformedMembers)
            } catch (error) {
                console.error('Error fetching members:', error)
            } finally {
                setLoadingMembers(false)
            }
        }

        // Fetch boards and members when the component mounts
        fetchBoards()
        fetchMembers()
    }, [updateOrdered, updateColumns, updateBoardMembers, updateAllMembers])

    const onDialogClose = async () => {
        closeDialog()
        await sleep(200)
        resetView()
    }

    const onDragEnd = (result: DropResult) => {
        if (result.combine) {
            if (result.type === 'COLUMN') {
                const shallow = [...ordered]
                shallow.splice(result.source.index, 1)
                updateOrdered(shallow)
                return
            }

            const column = columns[result.source.droppableId]
            const withQuoteRemoved = [...column]
            withQuoteRemoved.splice(result.source.index, 1)
            const newColumns = {
                ...columns,
                [result.source.droppableId]: withQuoteRemoved,
            }
            updateColumns(newColumns)
            return
        }

        if (!result.destination) {
            return
        }

        const source = result.source
        const destination = result.destination

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return
        }

        if (result.type === 'COLUMN') {
            const newOrdered = reoderArray(ordered, source.index, destination.index)
            updateOrdered(newOrdered)
            return
        }

        const data = reorderDragable<Record<string, Ticket[]>>({
            quoteMap: columns,
            source,
            destination,
        })

        updateColumns(data.quoteMap)
    }

    if (loadingBoards || loadingMembers) {
        return <Spinner />
    }

    return (
        <>
            <AdaptiveCard className="h-full" bodyClass="h-full flex flex-col">
            
                <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                    <Droppable
                        droppableId="board"
                        type="COLUMN"
                        direction="horizontal"
                        ignoreContainerClipping={containerHeight}
                        isCombineEnabled={isCombineEnabled}
                    >
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                className="scrumboard flex flex-col flex-auto w-full mb-2"
                                {...provided.droppableProps}
                            >
                                <div className="scrumboard-body flex max-w-full overflow-x-auto h-full mt-4 gap-4">
                                    {ordered.map((key, index) => (
                                        <BoardColumn
                                            key={key}
                                            index={index}
                                            title={key}
                                            contents={columns[key]}
                                            isScrollable={withScrollableColumns}
                                            isCombineEnabled={isCombineEnabled}
                                            useClone={useClone}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </AdaptiveCard>
            <Dialog
                isOpen={dialogOpen}
                width={dialogView === 'TICKET' ? 700 : 520}
                closable={dialogView !== 'TICKET'}
                onClose={onDialogClose}
                onRequestClose={onDialogClose}
            >
                <Suspense
                    fallback={
                        <div className="my-4 text-center">
                            <Spinner />
                        </div>
                    }
                >
                    {dialogView === 'TICKET' && (
                        <TicketContent onTicketClose={onDialogClose} />
                    )}
                </Suspense>
            </Dialog>
        </>
    )
}

export default Board
