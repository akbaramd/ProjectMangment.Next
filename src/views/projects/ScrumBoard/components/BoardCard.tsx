import { forwardRef } from 'react';
import Card from '@/components/ui/Card';
import { TbMessageCircle, TbPaperclip, TbRowRemove } from 'react-icons/tb';
import { useScrumBoardStore } from '../store/scrumBoardStore';
import { apiDeleteTask } from '@/services/TaskService';
import type { Ticket } from '../types';
import type { CardProps } from '@/components/ui/Card';
import { TaskDto } from '@/@types/task';
import { Dropdown } from '@/components/ui';
import EllipsisButton from '@/components/shared/EllipsisButton';

interface BoardCardProps extends CardProps {
    data: TaskDto;
}

const BoardCard = forwardRef<HTMLDivElement, BoardCardProps>((props, ref) => {
    const { openDialog, updateDialogView, setSelectedTicketId, updateTasks, tasks } = useScrumBoardStore();

    const { data, ...rest } = props;
    const { id, title, comments, assigneeMembers } = data;

    const onCardClick = () => {
        openDialog();
        updateDialogView('TICKET');
        setSelectedTicketId(id);
    };

    const onDeleteTask = async () => {
        try {
            await apiDeleteTask(id); // Call the API to delete the task by ID

            // Update the state by filtering out the deleted task
            const updatedTasks = tasks.filter(task => task.id !== id);
            updateTasks(updatedTasks); // Update the store with the new tasks list
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <Card
            ref={ref}
            clickable
            className="mb-2 flex justify-between"
            bodyClass="p-4 flex justify-between items-center w-full"
            {...rest}
        >
            <div onClick={() => onCardClick()} className="heading-text text-sm">{id}</div>

            <Dropdown placement="bottom-end" renderTitle={<EllipsisButton />}>
                <Dropdown.Item
                    eventKey="deleteTask"
                    onClick={onDeleteTask}
                >
                    <span className="text-lg">
                        <TbRowRemove />
                    </span>
                    <span>حذف وظیفه</span>
                </Dropdown.Item>
            </Dropdown>
        </Card>
    );
});

BoardCard.displayName = 'BoardCard';

export default BoardCard;
