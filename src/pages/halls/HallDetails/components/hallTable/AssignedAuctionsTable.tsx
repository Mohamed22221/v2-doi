import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import { useAssignedAuctionsTableColumns } from './AssignedAuctionsTableColumns'
import {
    HallAuctionItem,
    AssignableAuctionItem,
    HallAuctionStatus,
} from '@/api/types/hall-auctions'
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
    mode = 'api',
    items: localItems = [],
    onItemsChange,
}: {
    hallStatus?: string
    hallName?: string
    mode?: 'api' | 'local'
    items?: HallAuctionItem[]
    onItemsChange?: (items: HallAuctionItem[]) => void
}) {
    const { t } = useTranslation()
    const { id: hallId } = useParams<{ id: string }>()

    // 1. API Hooks
    const {
        items: apiItems,
        isLoading: isApiLoading,
        isError,
        errorMessage,
        total: apiTotal,
    } = useGetHallAuctions(mode === 'api' ? (hallId ?? '') : '')
    const { mutate: reorderItem } = useReorderHallItem()

    // 2. State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [orderedItems, setOrderedItems] = useState<HallAuctionItem[]>([])

    // 3. Effects
    useEffect(() => {
        if (mode === 'api') {
            setOrderedItems(apiItems)
        } else {
            setOrderedItems(localItems)
        }
    }, [apiItems, localItems, mode])

    // 4. Table Config & Hooks
    const isDraggableHall = hallStatus === 'DRAFT' || hallStatus === 'SCHEDULED'
    const filtersConfig = useAssignedAuctionsTableFilters()

    const handleDelete = useCallback(
        (id: string) => {
            if (mode === 'local') {
                const updated = orderedItems.filter((item) => item.id !== id)
                onItemsChange?.(updated)
            }
        },
        [mode, orderedItems, onItemsChange],
    )

    const { columns, deleteModal } = useAssignedAuctionsTableColumns(
        isDraggableHall,
        mode === 'local' ? handleDelete : undefined,
        mode,
    )

    const tableQ = useServerTable({
        pageSize: 1000,
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
            if (mode === 'local') {
                const updated = [...orderedItems]
                const dragIndex = orderedItems.findIndex(
                    (item) => item.id === draggedItem.id,
                )
                if (dragIndex !== -1) {
                    const [removed] = updated.splice(dragIndex, 1)
                    updated.splice(newIndex, 0, removed)
                    onItemsChange?.(updated)
                }
                return
            }

            const globalNewOrder = newIndex + 1

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
                        setOrderedItems(apiItems)
                    },
                },
            )
        },
        [reorderItem, t, apiItems, mode, orderedItems, onItemsChange],
    )

    const handleAssignItemsLocal = useCallback(
        (selectedItems: AssignableAuctionItem[]) => {
            // Map selected items to HallAuctionItem shape if necessary
            // In local mode, the modal will return full objects
            const newItems = selectedItems
                .filter((item) => !orderedItems.some((i) => i.id === item.id))
                .map((item) => ({
                    id: item?.id,
                    status: item?.effectiveStatus as unknown as HallAuctionStatus,
                    product: {
                        id: item.product?.id || item.id,
                        title: item.title,
                        auctionStartingPriceIncVat: (
                            item.auctionStartingPriceIncVat ?? 0
                        ).toString(),
                        user: item.user,
                        images: item.images,
                        // Missing category here might be okay for now if not used in creation flow display
                    },
                })) as HallAuctionItem[]

            onItemsChange?.([...orderedItems, ...newItems])
        },
        [orderedItems, onItemsChange],
    )

    return (
        <DndProvider options={HTML5toTouch}>
            <div className="flex flex-col">
                <AssignedAuctionsTableHeader
                    isDraggable={isDraggableHall}
                    onAddClick={() => setIsAssignModalOpen(true)}
                />

                <ViewTable<HallAuctionItem>
                    showSearch={mode === 'api'}
                    enableDrag={isDraggableHall}
                    columns={columns}
                    data={orderedItems}
                    total={
                        mode === 'api' ? (apiTotal ?? 0) : orderedItems.length
                    }
                    pageSize={1000}
                    searchPlaceholder={t(
                        'halls.details.table.searchPlaceholder',
                    )}
                    searchValue={tableQ.searchValue}
                    filters={mode === 'api' ? tableQ.filters : undefined}
                    isLoading={mode === 'api' ? isApiLoading : false}
                    emptyText={t('common.noData')}
                    requestedPage={1}
                    isError={mode === 'api' ? isError : false}
                    errorText={errorMessage ?? ''}
                    showExportButton={false}
                    showPagination={false}
                    onFilterChange={tableQ.onFilterChange}
                    onSearchChange={tableQ.onSearchChange}
                    onPageChange={() => {}}
                    onClearAll={tableQ.clearAll}
                    onRowReorder={handleRowReorder}
                    onReorderEnd={handleReorderEnd}
                />
            </div>

            {mode === 'api' && deleteModal}

            <AssignLiveAuctionsModal
                isOpen={isAssignModalOpen}
                hallName={hallName || ''}
                hallId={hallId ?? ''}
                skipApiCall={mode === 'local'}
                onOpenChange={setIsAssignModalOpen}
                onAssignItems={
                    mode === 'local' ? handleAssignItemsLocal : undefined
                }
            />
        </DndProvider>
    )
}
