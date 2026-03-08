import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { DndProvider } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import { useAssignedAuctionsTableColumns } from './AssignedAuctionsTableColumns'
import { HallAuctionItem } from '@/api/types/hall-auctions'
import { useGetHallAuctions } from '@/api/hooks/halls'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { Button, Icon } from '@/components/ui'
import AssignLiveAuctionsModal from './AssignLiveAuctionsModal'
import { HiOutlinePlus } from 'react-icons/hi'

export default function AssignedAuctionsTable({
    hallStatus,
    hallName,
}: {
    hallStatus?: string
    hallName?: string
}) {
    const { t } = useTranslation()
    const { id: hallId } = useParams<{ id: string }>()

    const { items, isLoading, isError, errorMessage, total, limit } =
        useGetHallAuctions(hallId ?? '')

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

    // ── Local reorder state ──────────────────────────────────────────
    const [orderedItems, setOrderedItems] = useState<HallAuctionItem[]>([])

    // Sync server data → local ordered list (only when items actually change)
    useEffect(() => {
        if (items && items.length > 0) {
            setOrderedItems(items)
        }
    }, [items])

    /** Swap two rows by their indices (standard splice approach) */
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

    // ── Filters / search / pagination ────────────────────────────────
    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('halls.details.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('halls.details.table.status.live'),
                        value: 'ACTIVE',
                    },
                    {
                        label: t('halls.details.table.status.scheduled'),
                        value: 'SCHEDULED',
                    },
                    {
                        label: t('halls.details.table.status.hidden'),
                        value: 'HIDDEN',
                    },
                    {
                        label: t('halls.details.table.status.ended'),
                        value: 'ENDED',
                    },
                    {
                        label: t('halls.details.table.status.rejected'),
                        value: 'REJECTED',
                    },
                    {
                        label: t('halls.details.table.status.cancelled'),
                        value: 'CANCELLED',
                    },
                ],
                placeholder: t('halls.details.table.filters.allStatus'),
                isSearchable: false,
            },
        ],
        [t],
    )

    const tableQ = useServerTable({
        pageSize: limit,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const isDraggableHall = hallStatus === 'DRAFT' || hallStatus === 'SCHEDULED'
    const { columns, deleteModal } =
        useAssignedAuctionsTableColumns(isDraggableHall)

    return (
        <DndProvider options={HTML5toTouch}>
            <div className="flex flex-col">
                {/* Header Section */}
                {isDraggableHall && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 px-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className=" flex items-center justify-center flex-shrink-0">
                                <Icon name="bundleList" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <h3 className="text-xl font-bold text-[#1E293B] dark:text-gray-100">
                                    {t('halls.details.header.title')}
                                </h3>
                                <p className="text-sm text-slate-400 dark:text-gray-400 max-w-md">
                                    {t('halls.details.header.subtitle')}
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="solid"
                            className="!rounded-xl font-bold px-6 h-11 flex items-center gap-2"
                            icon={
                                <HiOutlinePlus className="text-primary-50 dark:text-primary-100" />
                            }
                            onClick={() => setIsAssignModalOpen(true)}
                        >
                            {t('halls.details.header.addItems')}
                        </Button>
                    </div>
                )}

                {/* Draggable Info Banner */}
                {isDraggableHall && (
                    <div className="flex items-center gap-4 p-5 mx-5 bg-[#FFFBEB] dark:bg-yellow-900/10 border border-[#FEF3C7] dark:border-yellow-900/20 rounded-2xl mb-8 shadow-sm">
                        <Icon
                            name="infoAlert"
                            className="text-yellow-400 w-5 h-5 justify-center items-center"
                        />

                        <p className="text-[14px] text-neutral-950 dark:text-neutral-200 leading-normal font-semibold">
                            {t('halls.details.banner.draggable')}
                        </p>
                    </div>
                )}

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
