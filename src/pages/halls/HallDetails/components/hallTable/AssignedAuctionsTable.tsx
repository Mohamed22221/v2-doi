import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import { useAssignedAuctionsTableColumns } from './AssignedAuctionsTableColumns'
import { HallAuctionItem } from '@/api/types/hall-auctions'
import { useGetHallAuctions } from '@/api/hooks/halls'
import { useReorderHallItem } from '@/api/hooks/live-auctions'
import { useServerTable } from '@/utils/hooks/useServerTable'
import { Notification, toast } from '@/components/ui'
import AssignLiveAuctionsModal from '../hallHeader/AssignLiveAuctionsModal'
import { getApiErrorMessage } from '@/api/error'
import AssignedAuctionsTableHeader from './AssignedAuctionsTableHeader'
import { useAssignedAuctionsTableFilters } from './useAssignedAuctionsTableFilters'

// ── Main Component ─────────────────────────────────────────────

export default function AssignedAuctionsTable({
    hallStatus,
    hallName,
    // onDataChange,
}: {
    hallStatus?: string
    hallName?: string
    onDataChange?: (items: HallAuctionItem[]) => void
}) {
    const { t } = useTranslation()
    const { id: hallId } = useParams<{ id: string }>()

    // 1. API Hooks
    const { items, isLoading, isError, errorMessage, total, limit } =
        useGetHallAuctions(hallId ?? '')
    const { mutate: reorderItem } = useReorderHallItem()

    // 2. State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [orderedItems, setOrderedItems] = useState<HallAuctionItem[]>([])

    // 3. Effects
    useEffect(() => {
        setOrderedItems(items)
    }, [items])

    // useEffect(() => {
    //     onDataChange?.(orderedItems)
    // }, [orderedItems, onDataChange])

    // 4. Table Config & Hooks
    const isDraggableHall = hallStatus === 'DRAFT' || hallStatus === 'SCHEDULED'
    const filtersConfig = useAssignedAuctionsTableFilters()
    const { columns, deleteModal } =
        useAssignedAuctionsTableColumns(isDraggableHall)

    const tableQ = useServerTable({
        pageSize: limit,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    // 5. Callbacks
    const handleRowReorder = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            setOrderedItems((prev) => {
                const updated = [...prev]
                const [removed] = updated.splice(dragIndex, 1)
                updated.splice(hoverIndex, 0, removed)
                return updated
            })
        },
        [],
    )

    const handleReorderEnd = useCallback(
        (draggedItem: HallAuctionItem, newIndex: number) => {
            const globalNewOrder =
                (tableQ.currentPage - 1) * tableQ.pageSize + newIndex + 1

            reorderItem(
                {
                    id: draggedItem.id,
                    data: { newOrder: globalNewOrder },
                },
                {
                    onSuccess: () => {
                        toast.push(
                            <Notification
                                title={t('halls.details.reorder.success', {
                                    defaultValue: 'Order updated successfully',
                                })}
                                type="success"
                            />,
                        )
                    },
                    onError: (error) => {
                        toast.push(
                            <Notification
                                title={getApiErrorMessage(error)}
                                type="danger"
                            />,
                        )
                        setOrderedItems(items)
                    },
                },
            )
        },
        [reorderItem, t, items, tableQ.currentPage, tableQ.pageSize],
    )

    return (
        <DndProvider options={HTML5toTouch}>
            <div className="flex flex-col">
                <AssignedAuctionsTableHeader
                    isDraggable={isDraggableHall}
                    onAddClick={() => setIsAssignModalOpen(true)}
                />

                <ViewTable<HallAuctionItem>
                    showSearch
                    enableDrag={isDraggableHall}
                    columns={columns}
                    data={orderedItems}
                    total={total ?? 0}
                    pageSize={tableQ.pageSize}
                    searchPlaceholder={t(
                        'halls.details.table.searchPlaceholder',
                    )}
                    searchValue={tableQ.searchValue}
                    filters={tableQ.filters}
                    isLoading={isLoading}
                    emptyText={t('common.noData')}
                    requestedPage={tableQ.requestedPage}
                    isError={isError}
                    errorText={errorMessage ?? ''}
                    showExportButton={false}
                    onPageChange={tableQ.onPageChange}
                    onFilterChange={tableQ.onFilterChange}
                    onSearchChange={tableQ.onSearchChange}
                    onClearAll={tableQ.clearAll}
                    onRowReorder={handleRowReorder}
                    onReorderEnd={handleReorderEnd}
                />
            </div>

            {deleteModal}

            <AssignLiveAuctionsModal
                isOpen={isAssignModalOpen}
                hallName={hallName || ''}
                hallId={hallId ?? ''}
                onOpenChange={setIsAssignModalOpen}
            />
        </DndProvider>
    )
}
