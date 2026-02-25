import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { HallAuctionItem, HallAuctionStatus } from '@/api/types/hall-auctions'
import { CategoryBreadcrumb } from '@/components/helpers/CategoryBreadcrumb'
import { Category } from '@/api/types/categories'

type StatusVariant = 'success' | 'warning' | 'neutral' | 'danger' | 'info'

const getAuctionStatusVariant = (status?: HallAuctionStatus): StatusVariant => {
    switch (status) {
        case 'LIVE': return 'success'
        case 'SCHEDULED': return 'warning'
        case 'HIDDEN': return 'neutral'
        case 'ENDED': return 'neutral'
        case 'REJECTED': return 'danger'
        case 'CANCELLED': return 'danger'
        default: return 'neutral'
    }
}

const getSellerName = (item: HallAuctionItem): string => {
    const user = item.product?.user
    if (!user) return '—'
    if (user.businessName) return user.businessName
    const full = [user.firstName, user.lastName].filter(Boolean).join(' ')
    return full || '—'
}


const getDisplayDate = (item: HallAuctionItem): string | null => {
    if (item.status === 'SCHEDULED' && item.scheduledAt) return item.scheduledAt
    if (item.startedAt) return item.startedAt
    if (item.endedAt) return item.endedAt
    return null
}

export function useAssignedAuctionsTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<HallAuctionItem>[]>(() => {
        return [
            {
                header: t('halls.details.table.columns.item'),
                accessorKey: 'product.title',
                cell: ({ row }) => {
                    const item = row.original
                    return (
                        <TwoLineText
                            title={item.product?.title ?? '—'}
                            subtitle={item.id}
                            size="sm"
                        />
                    )
                },
            },
            {
                header: t('halls.details.table.columns.seller'),
                accessorKey: 'product.user',
                cell: ({ row }) => <Link to={`/sellers/${row.original?.product?.user?.id}`}>{getSellerName(row.original)}</Link>,
            },
            {
                header: t('halls.details.table.columns.category'),
                accessorKey: 'product.category',
                cell: ({ row }) => {

                    return (
                        <CategoryBreadcrumb category={row.original?.product?.category as Category} orientation="vertical" size="md" />
                    )
                },
            },
            {
                header: t('halls.details.table.columns.status'),
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row.original.status
                    const key = status?.toLowerCase() as string
                    const label = status ? t(`halls.details.table.status.${key}`, { defaultValue: status }) : '—'
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
                header: t('halls.details.table.columns.dateRange'),
                id: 'date',
                cell: ({ row }) => {
                    const dateStr = getDisplayDate(row.original)
                    if (!dateStr) return <span className="text-gray-400">—</span>
                    const { date, time } = formatDateTime(dateStr)
                    return (
                        <div className="flex flex-col text-[12px] text-gray-700 dark:text-gray-300">
                            <span>{date} – {time}</span>
                        </div>
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="w-[80px]">
                        <Button
                            variant="default"
                            className="!rounded-xl"
                            onClick={() => navigate(`/live-auctions/${row.original.id}`)}
                        >
                            {t('halls.actions.view')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
