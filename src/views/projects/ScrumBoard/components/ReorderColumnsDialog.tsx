import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button, Dialog } from '@/components/ui';
import { BoardColumnDto } from '@/@types/projects';
import { apiUpdateBoardColumn } from '@/services/BoardService';
import { Spinner } from '@/components/ui';
import { useScrumBoardStore } from '../store/scrumBoardStore';
import { useParams } from 'react-router-dom';
import { UpdateBoardColumnDto } from '@/@types/boards';

type ReorderColumnsDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    columns: BoardColumnDto[];
    fetchBoards: () => void;
};

const ReorderColumnsDialog: React.FC<ReorderColumnsDialogProps> = ({ isOpen, onClose, columns, fetchBoards }) => {
    const { boardId } = useParams();
    const [orderedColumns, setOrderedColumns] = useState<BoardColumnDto[]>(columns);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOrderedColumns(columns); // Reset orderedColumns when columns prop changes
    }, [columns]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }
    
        // Reorder columns based on drag result
        const reordered = Array.from(orderedColumns);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
    
        // Update the order field based on the new index
        const updatedColumns = reordered.map((column, index) => ({
            ...column,
            order: index, // Set the new order based on the index
        }));
    
        console.log(updatedColumns); // Debugging - view the reordered columns with updated order
    
        // Update the state with the new ordered columns
        setOrderedColumns(updatedColumns);
    };
    

    const saveNewOrder = async () => {
        if (!boardId) return;
        setLoading(true);

        try {
            await Promise.all(
                orderedColumns.map((column, index) => {
                    const updateData: UpdateBoardColumnDto = { order: index,name:column.name };
                    return apiUpdateBoardColumn(boardId, column.id, updateData);
                })
            );
            await fetchBoards(); // Fetch the updated board after saving
            onClose(); // Close the dialog
        } catch (error) {
            console.error('Error updating column order:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose} width={400} >
            {loading ? (
                <Spinner />
            ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="columns" type="COLUMN" direction="vertical">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-2 p-2 bg-white max-h-96 overflow-y-auto rounded"
                                style={{ minHeight: '200px' }}
                            >
                                {orderedColumns.map((column, index) => (
                                    <Draggable key={column.id} draggableId={column.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`p-2 bg-gray-100 rounded shadow ${snapshot.isDragging ? 'bg-blue-100' : ''}`}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    userSelect: 'none',
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {column.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
            <div className="mt-4 flex gap-2">
                <Button variant="solid" onClick={saveNewOrder} disabled={loading}>
                    ذخیره ترتیب
                </Button>
                <Button onClick={onClose} className="ml-2">
                    انصراف
                </Button>
            </div>
        </Dialog>
    );
};

export default ReorderColumnsDialog;
