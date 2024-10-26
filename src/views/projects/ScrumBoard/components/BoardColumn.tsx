import { Draggable } from '@hello-pangea/dnd'
import BoardTitle from './BoardTitle'
import BoardCardList, { BaseBoardProps } from './BoardCardList'
import { BoardColumnDto } from '@/@types/projects'
import { Card } from '@/components/ui'

interface BoardColumnProps extends BaseBoardProps {
    column: BoardColumnDto
    index: number
    isScrollable?: boolean
}

const BoardColumn = (props: BoardColumnProps) => {
    const { column, contents, index, isScrollable, isCombineEnabled, useClone } =
        props

    return (
        <Draggable draggableId={column.id} index={index}>
            {(provided, snapshot) => (
                <Card
                    ref={provided.innerRef}
                    className="board-column flex flex-col mb-3 min-w-[300px] w-[300px] max-w-[300px] p-0rounded-lg dark:bg-gray-900 bg-gray-50 rounded-2xl"
                    bodyClass='grow flex flex-col'
                    {...provided.draggableProps}
                    header={{
                        content:<BoardTitle
                        column={column}
                        dragHandleProps={provided.dragHandleProps}
                    />
                    }}
                >
                    
                    <BoardCardList
                        listId={column.id}
                        listType="CONTENT"
                        className={snapshot.isDragging ? 'is-dragging' : ''}
                        contents={contents?.sort((a, b) => a.order + b.order)}
                        internalScroll={isScrollable}
                        isCombineEnabled={isCombineEnabled}
                        useClone={useClone}
                    />
                </Card>
            )}
        </Draggable>
    )
}

export default BoardColumn
