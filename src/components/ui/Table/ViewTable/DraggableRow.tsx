import { useRef, type ReactNode } from 'react'
import { useDrag, useDrop, type ConnectDragSource } from 'react-dnd'
import type { Identifier } from 'dnd-core'
import classNames from 'classnames'
import Tr from '../Tr'

const ROW_TYPE = 'TABLE_ROW'

interface DragItem {
    index: number
    id: string | number
    type: string
}

export interface DraggableRowProps {
    /** Unique identifier for this row */
    id: string | number
    /** Row index in the current data array */
    index: number
    /** Callback fired when a row is dragged over another */
    onMoveRow: (dragIndex: number, hoverIndex: number) => void
    /** Callback fired when a row is dropped successfully */
    onReorderEnd?: (index: number) => void
    /** Optional className for the <tr> */
    className?: string
    /** Render-prop children — receives the drag connector for the handle */
    children: (dragRef: ConnectDragSource) => ReactNode
    /** Whether this row can be dragged */
    canDrag?: boolean
    /** Whether other rows can be dropped on this row */
    canDrop?: boolean
}

/**
 * A table row that supports react-dnd drag-and-drop reordering.
 *
 * **Ref strategy:**
 * - `drag`    → forwarded via render-children so the grip icon can attach it
 * - `preview` → attached to the `<tr>` so the whole row follows the cursor
 * - `drop`    → attached to the `<tr>` for hover/swap detection
 */
export default function DraggableRow({
    id,
    index,
    onMoveRow,
    onReorderEnd,
    className,
    children,
    canDrag = true,
    canDrop = true,
}: DraggableRowProps) {
    const rowRef = useRef<HTMLTableRowElement>(null)

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: ROW_TYPE,
        collect: (monitor) => ({ handlerId: monitor.getHandlerId() }),
        canDrop: () => canDrop,
        hover(item, monitor) {
            if (!rowRef.current) return

            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) return

            // Standard midpoint calculation to prevent flickering
            const hoverBoundingRect = rowRef.current.getBoundingClientRect()
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            const clientOffset = monitor.getClientOffset()
            if (!clientOffset) return

            const hoverClientY = clientOffset.y - hoverBoundingRect.top

            // Dragging downwards — only swap when cursor is below 50%
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
            // Dragging upwards — only swap when cursor is above 50%
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

            onMoveRow(dragIndex, hoverIndex)
            // Mutate the item index in-place for performance
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag, preview] = useDrag({
        type: ROW_TYPE,
        item: () => ({ id, index, type: ROW_TYPE }),
        canDrag: () => canDrag,
        end: (item, monitor) => {
            if (item && monitor.didDrop() && onReorderEnd) {
                onReorderEnd(item.index)
            }
        },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    })

    // Attach drop + preview to the <tr>
    drop(preview(rowRef))

    return (
        <Tr
            ref={rowRef as React.RefObject<HTMLElement>}
            className={classNames(className, isDragging && 'opacity-40')}
            style={{ cursor: 'default' }}
            data-handler-id={handlerId}
        >
            {children(drag)}
        </Tr>
    )
}
