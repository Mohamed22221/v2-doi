import { ColumnDef } from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { MdDragIndicator } from 'react-icons/md'
import type { ConnectDragSource } from 'react-dnd'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import { HallAuctionItem, HallAuctionStatus } from '@/api/types/hall-auctions'
import { CategoryBreadcrumb } from '@/components/helpers/CategoryBreadcrumb'
import { Category } from '@/api/types/categories'
import SellerNameCell from '@/components/helpers/SellerNameCell'
import { Icon } from '@/components/ui'
import DeleteAssignedItemModal from './DeleteAssignedItemModal'

type StatusVariant = 'success' | 'warning' | 'neutral' | 'danger' | 'info'

const getAuctionStatusVariant = (status?: HallAuctionStatus): StatusVariant => {
    switch (status) {
        case 'ACTIVE':
            return 'success'
        case 'SCHEDULED':
            return 'warning'
        case 'HIDDEN':
            return 'neutral'
        case 'ENDED':
            return 'neutral'
        case 'REJECTED':
            return 'danger'
        case 'CANCELLED':
            return 'danger'
        default:
            return 'neutral'
    }
}

const getAuctionStatusLabel = (
    status: HallAuctionStatus | undefined,
    t: (key: string, options?: Record<string, unknown>) => string,
): string => {
    if (!status) return '—'
    const key = status === 'ACTIVE' ? 'live' : status.toLowerCase()
    return t(`halls.details.table.status.${key}`, {
        defaultValue: status,
    })
}

export function useAssignedAuctionsTableColumns(isDraggable: boolean) {
    const { t } = useTranslation()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<{
        id: string
        title: string
    } | null>(null)

    const handleDeleteClick = (id: string, title: string) => {
        setSelectedItem({ id, title })
        setIsDeleteModalOpen(true)
    }

    const columns = useMemo<ColumnDef<HallAuctionItem>[]>(() => {
        return [
            {
                id: 'drag-handle',
                header: t('halls.details.table.columns.order', {
                    defaultValue: 'Order',
                }),
                size: 70,
                cell: (info) => {
                    const index = info.row.index + 1

                    if (!isDraggable) {
                        return (
                            <div className="flex items-center px-1 font-medium text-gray-900 dark:text-gray-300">
                                {index}
                            </div>
                        )
                    }

                    // Otherwise, show number + drag handle
                    const dragRef = (
                        info as unknown as { dragRef?: ConnectDragSource }
                    ).dragRef

                    return (
                        <div className="flex items-center justify-start gap-4">
                            <button
                                ref={(node) => {
                                    dragRef?.(node)
                                }}
                                type="button"
                                aria-label={t('common.reorder', {
                                    defaultValue: 'Reorder row',
                                })}
                                className="cursor-grab active:cursor-grabbing text-primary-300 hover:text-primary-600 dark:text-gray-500 dark:hover:text-gray-300"
                            >
                                <MdDragIndicator
                                    aria-hidden="true"
                                    role="presentation"
                                    focusable="false"
                                    fill="currentColor"
                                    size={18}
                                />
                            </button>
                            <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[1.5rem]">
                                {index}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: t('halls.details.table.columns.item'),
                accessorKey: 'product.title',
                cell: ({ row }) => {
                    const item = row.original
                    return (
                        <TwoLineText
                            title={item.product?.title ?? '—'}
                            imageAlt={item.product?.title ?? '—'}
                            image={item.product?.images?.[0]?.url}
                            titleLabel={t('halls.details.table.columns.item')}
                            size="sm"
                        />
                    )
                },
            },
            {
                header: t('halls.details.table.columns.seller'),
                accessorKey: 'product.user',
                cell: ({ row }) => (
                    <SellerNameCell user={row.original.product?.user} />
                ),
            },
            {
                header: t('halls.details.table.columns.category'),
                accessorKey: 'product.category',
                cell: ({ row }) => {
                    return (
                        <CategoryBreadcrumb
                            category={
                                row.original?.product?.category as Category
                            }
                            orientation="vertical"
                            size="md"
                        />
                    )
                },
            },
            {
                header: t('halls.details.table.columns.status'),
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row.original.status
                    const label = getAuctionStatusLabel(status, t)
                    return (
                        <StatusPill
                            variant={getAuctionStatusVariant(status)}
                            label={label}
                            size="sm"
                        />
                    )
                },
            },
            {
                header: t('liveAuctions.details.startingPrice'),
                id: 'product.auctionStartingPriceIncVat',
                cell: ({ row }) => {
                    const startingPrice = parseFloat(
                        row?.original?.product?.auctionStartingPriceIncVat ??
                            '0',
                    )
                    return (
                        <span className="flex items-center gap-1 text-neutral-900 dark:text-gray-300 font-semibold text-base">
                            {startingPrice.toLocaleString()}
                            <Icon name="riyal" />
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="w-[90px] flex items-center gap-3">
                        <Link
                            to={`/live-auctions/${row.original.id}`}
                            className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 w-[40px] h-[40px] flex items-center justify-center"
                        >
                            <Icon name="eya" />
                        </Link>
                        {isDraggable && (
                            <button
                                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 w-[40px] h-[40px] flex items-center justify-center"
                                onClick={() =>
                                    handleDeleteClick(
                                        row.original.id,
                                        row.original.product?.title ?? '',
                                    )
                                }
                            >
                                <Icon name="delete" className="text-red-400" />
                            </button>
                        )}
                    </div>
                ),
            },
        ]
    }, [t, isDraggable])

    return {
        columns,
        deleteModal: (
            <DeleteAssignedItemModal
                isOpen={isDeleteModalOpen}
                id={selectedItem?.id ?? ''}
                onClose={() => setIsDeleteModalOpen(false)}
            />
        ),
    }
}
