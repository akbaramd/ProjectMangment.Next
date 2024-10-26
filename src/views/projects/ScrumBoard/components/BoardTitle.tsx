import { useState } from 'react'
import { Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Dropdown from '@/components/ui/Dropdown'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EllipsisButton from '@/components/shared/EllipsisButton'
import { useScrumBoardStore } from '../store/scrumBoardStore'
import {
    TbPencil,
    TbCirclePlus,
    TbTrash,
    TbCircleXFilled,
} from 'react-icons/tb'
import { useForm, Controller } from 'react-hook-form'
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import type { Columns } from '../types'
import { BoardColumnDto } from '@/@types/projects'
import { UpdateBoardColumnDto } from '@/@types/boards'
import { apiUpdateBoardColumn } from '@/services/BoardService'
import { useParams } from 'react-router-dom'

type BoardTitleProps = {
    dragHandleProps?: DraggableProvidedDragHandleProps | null
    column: BoardColumnDto
}

type RenameFormProps = {
    title: string
    closeRenameForm: () => void
    columns: BoardColumnDto[]
    ordered: string[]
    onEnter: (newColumns:BoardColumnDto[], newOrder: string[]) => void
}

type FormSchema = {
    title: string
}

const RenameForm = ({
    title,
    closeRenameForm,
    columns = [],
    ordered,
    onEnter,
}: RenameFormProps) => {
    const { boardId } = useParams(); // Get the board ID from the URL params

    const onFormSubmit = async (value: FormSchema) => {
        const newTitle = value.title.trim();

        // Check if the new title already exists in the ordered list
        if (ordered.includes(newTitle)) {
            closeRenameForm();
            return;
        }

        // Find the column to update
        const columnToUpdate = columns.find(col => col.name === title);
        if (!columnToUpdate || !boardId) {
            closeRenameForm();
            return;
        }

        try {
            // Call the API to update the column name
            const updateData: UpdateBoardColumnDto = { name: newTitle ,order: columnToUpdate.order};
            await apiUpdateBoardColumn(boardId, columnToUpdate.id, updateData);

            // Update columns locally after API success
            const newColumns = columns.map((col) => {
                if (col.id === columnToUpdate.id) {
                    return {
                        ...col,
                        name: newTitle,
                        order: columnToUpdate.order
                    };
                }
                return col;
            });

            // Update the order array to reflect the new column name
            const newOrder = ordered.map((elm) => (elm === title ? newTitle : elm));

            // Pass the updated columns and order back through the onEnter callback
            onEnter(newColumns, newOrder);
        } catch (error) {
            console.error('Error updating column:', error);
        } finally {
            closeRenameForm();
        }
    };

    const { control, handleSubmit } = useForm<FormSchema>({
        defaultValues: {
            title,
        },
    });

    return (
        <>
            <Form onSubmit={handleSubmit(onFormSubmit)}>
                <Controller
                    name="title"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Input type="text" autoComplete="off" {...field} />
                    )}
                />
            </Form>
        </>
    );
};


const BoardTitle = (props: BoardTitleProps) => {
    const { dragHandleProps, column } = props

    const {
        columns,
        ordered,
        openDialog,
        updateColumns,
        updateDialogView,
        setSelectedColumn,
        updateOrdered,
    } = useScrumBoardStore()

    const [renameActive, setRenameActive] = useState(false)
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)

    const onRenameActive = () => {
        setRenameActive(true)
    }

    const onRenameDeactivate = () => {
        setRenameActive(false)
    }

    const onConfirmDeleteClose = () => {
        setConfirmDeleteDialog(false)
    }

    const onBoardDelete = () => {
        setConfirmDeleteDialog(true)
    }

    const onAddNewTicket = () => {
        openDialog()
        updateDialogView('NEW_TICKET')
        setSelectedColumn(column)
    }

    const onDelete = () => {
 
    }

    const handleEnter = (newColumns:BoardColumnDto[], newOrder: string[]) => {
        updateColumns(newColumns)
        updateOrdered(newOrder)
    }

    return (
        <div
            className="board-title  flex justify-between items-center"
            {...dragHandleProps}
        >
            {renameActive ? (
                <>
                    <RenameForm
                        title={column.name || ''}
                        closeRenameForm={onRenameDeactivate}
                        columns={columns }
                        ordered={ordered}
                        onEnter={handleEnter}
                    />
                    <TbCircleXFilled
                        className="cursor-pointer text-lg"
                        onClick={onRenameDeactivate}
                    />
                </>
            ) : (
                <>
                    <h6>{column.name}</h6>
                    <Dropdown
                        placement="bottom-end"
                        renderTitle={<EllipsisButton />}
                    >
                        <Dropdown.Item
                            eventKey="renameBoard"
                            onClick={onRenameActive}
                        >
                            <span className="text-lg">
                                <TbPencil />
                            </span>
                            <span>تغییر نام</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="addTicket"
                            onClick={onAddNewTicket}
                        >
                            <span className="text-lg">
                                <TbCirclePlus />
                            </span>
                            <span>افزودن وظیفه</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                            eventKey="deleteBoard"
                            onClick={onBoardDelete}
                        >
                            <span className="text-lg">
                                <TbTrash />
                            </span>
                            <span>حذف برد</span>
                        </Dropdown.Item>
                    </Dropdown>
                </>
            )}
            <ConfirmDialog
                isOpen={confirmDeleteDialog}
                type="danger"
                title="Delete Board"
                onClose={onConfirmDeleteClose}
                onRequestClose={onConfirmDeleteClose}
                onCancel={onConfirmDeleteClose}
                onConfirm={onDelete}
            >
                <p>
                    Are you sure you want to delete this board? All the tickets
                    under this board will be deleted as well. This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default BoardTitle
