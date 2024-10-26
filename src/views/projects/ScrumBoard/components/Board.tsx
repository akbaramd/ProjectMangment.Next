import { lazy, Suspense, useEffect, useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import Spinner from '@/components/ui/Spinner';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import { useScrumBoardStore } from '../store/scrumBoardStore';
import sleep from '@/utils/sleep';
import { apiGetProjectDetails } from '@/services/ProjectService';
import { apiGetTasksBySprintId, apiUpdateTask } from '@/services/TaskService';
import { useParams } from 'react-router-dom';
import { Dropdown } from '@/components/ui';
import EllipsisButton from '@/components/shared/EllipsisButton';
import { TbPencil, TbMenuOrder, TbCircleXFilled } from 'react-icons/tb';
import ReorderColumnsDialog from './ReorderColumnsDialog';
import AddNewColumnContent from './AddNewColumnContent';
import AddNewMemberContent from './AddNewMemberContent';
import AddNewTicketContent from './AddNewTicketContent';
import BoardColumn from './BoardColumn';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { apiGetBoardDetails, apiUpdateBoard } from '@/services/BoardService';
import RenameForm from '@/components/RenameForm';
import { TaskDto } from '@/@types/task';

const TicketContent = lazy(() => import('./TicketContent'));

export type BoardProps = {
    containerHeight?: boolean;
    useClone?: any;
    isCombineEnabled?: boolean;
    withScrollableColumns?: boolean;
};

const Board = (props: BoardProps) => {
    const {
        columns,
        ordered,
        tasks,
        board,
        updateOrdered,
        updateColumns,
        updateBoard,
        updateBoardMembers,
        updateAllMembers,
        updateTasks,
        closeDialog,
        resetView,
        dialogView,
        dialogOpen,
    } = useScrumBoardStore();

    const { sprintId, projectId, boardId } = useParams();
    const { containerHeight, useClone, isCombineEnabled, withScrollableColumns } = props;

    const [loadingBoards, setLoadingBoards] = useState<boolean>(true);
    const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
    const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchBoards();
                await fetchMembers();
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingBoards(false);
                setLoadingMembers(false);
            }
        };

        fetchData();
    }, [updateOrdered, updateColumns, updateBoardMembers, updateAllMembers]);

    const fetchBoards = async () => {
        const tasks = await apiGetTasksBySprintId(sprintId || '', 100, 0);
        const boards = await apiGetBoardDetails(boardId || '');
        updateOrdered(boards?.columns?.sort((a, b) => a.order - b.order).map(c => c.id) || []);
        updateBoard(boards);
        updateColumns(boards?.columns || []);
        updateTasks(tasks?.results || []);
    };

    const fetchMembers = async () => {
        const projects = await apiGetProjectDetails(projectId || '');
        const transformedMembers = projects.members || [];
        updateBoardMembers(transformedMembers);
        updateAllMembers(transformedMembers);
    };

    const onDialogClose = async () => {
        closeDialog();
        await sleep(200);
        resetView();
        await fetchBoards();
    };

    const onDragEnd = async (result: DropResult) => {
        console.log(result);
        if (!result.destination) {
            return;
        }

        const source = result.source;
        const destination = result.destination;

        // If the task is moved within the same column and the index is the same, no action is needed
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        // Get tasks in the source and destination columns
        const sourceTasks = tasks.filter(t => t.boardColumn?.id === source.droppableId);
        const destinationTasks = tasks.filter(t => t.boardColumn?.id === destination.droppableId);

        // If reordering within the same column
        if (source.droppableId === destination.droppableId) {
            const columnTasks = [...sourceTasks];
            const [movedTask] = columnTasks.splice(source.index, 1);
            columnTasks.splice(destination.index, 0, movedTask);

            // Update the backend with the new order
            try {
                await Promise.all(
                    columnTasks.map((task, index) =>
                        apiUpdateTask(task.id, { order: index })
                    )
                );
            } catch (error) {
                console.error('Error updating task order:', error);
            }

            updateColumns(columns.map(col =>
                col.id === source.droppableId ? { ...col, tasks: columnTasks } : col
            ));
        } else {
            // Moving between columns
            const [movedTask] = sourceTasks.splice(source.index, 1);
            // movedTask.boardColumn = { id: destination.droppableId };
            destinationTasks.splice(destination.index, 0, movedTask);

            const updatedColumns = columns.map(col => {
                if (col.id === source.droppableId) {
                    return { ...col, tasks: sourceTasks };
                } else if (col.id === destination.droppableId) {
                    return { ...col, tasks: destinationTasks };
                }
                return col;
            });

            // Update the backend with the new column ID and order
            try {
                await apiUpdateTask(movedTask.id, {
                    boardColumnId: destination.droppableId,
                    order: destination.index
                });

                // Update the order for all tasks in the destination column
                await Promise.all(
                    destinationTasks.map((task, index) =>
                        apiUpdateTask(task.id, { order: index })
                    )
                );
            } catch (error) {
                console.error('Error updating task column or order:', error);
            }

            updateColumns(updatedColumns);
        }
        await fetchBoards();
    };

    const handleRenameSubmit = async (newTitle: string) => {
        if (!boardId) return;

        try {
            await apiUpdateBoard(boardId, { name: newTitle });
            setIsRenaming(false);
            await fetchBoards();
        } catch (error) {
            console.error('Error renaming the board:', error);
        }
    };

    if (loadingBoards || loadingMembers) {
        return <Spinner />;
    }

    return (
        <>
            <AdaptiveCard
                header={{
                    content: (
                        <div className='flex items-center justify-between'>
                            {isRenaming ? (
                                <>
                                    <RenameForm
                                        title={board?.name || ''}
                                        closeRenameForm={() => setIsRenaming(false)}
                                        onSubmit={handleRenameSubmit}
                                    />
                                    <TbCircleXFilled
                                        className="cursor-pointer text-lg ml-2"
                                        onClick={() => setIsRenaming(false)}
                                    />
                                </>
                            ) : (
                                <>
                                    <h6>{board?.name}</h6>
                                    <Dropdown placement="bottom-end" renderTitle={<EllipsisButton />}>
                                        <Dropdown.Item
                                            eventKey="renameBoard"
                                            onClick={() => setIsRenaming(true)}
                                        >
                                            <span className="text-lg">
                                                <TbPencil />
                                            </span>
                                            <span>تغییر نام</span>
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            eventKey="reorderColumns"
                                            onClick={() => setIsReorderDialogOpen(true)}
                                        >
                                            <span className="text-lg ">
                                                <TbMenuOrder />
                                            </span>
                                            <span>تغییر ترتیب</span>
                                        </Dropdown.Item>
                                    </Dropdown>
                                </>
                            )}
                        </div>
                    ),
                }}
                className="h-full flex flex-col"
                bodyClass="grow flex flex-col p-4"
            >
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                        droppableId={boardId || ''}
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
                                            column={columns.find(c => c.id === key)!}
                                            contents={tasks.filter(t => t.boardColumn?.id === key) || []} 
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
                <Suspense fallback={<Spinner />}>
                    {dialogView}
                    {dialogView === 'TICKET' && <TicketContent onTicketClose={onDialogClose} />}
                    {dialogView === 'NEW_TICKET' && <AddNewTicketContent onSuccess={fetchBoards} />}
                    {dialogView === 'NEW_COLUMN' && <AddNewColumnContent />}
                    {dialogView === 'ADD_MEMBER' && <AddNewMemberContent />}
                </Suspense>
            </Dialog>
            <ReorderColumnsDialog
                isOpen={isReorderDialogOpen}
                onClose={() => setIsReorderDialogOpen(false)}
                columns={columns}
                fetchBoards={fetchBoards}
            />
        </>
    );
};

export default Board;
