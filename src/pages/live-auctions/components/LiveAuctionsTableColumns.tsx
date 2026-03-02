import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import { HallItem } from '@/api/types/hall-auctions'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { getLiveAuctionStatusLabel, getLiveAuctionStatusVariant } from './GetStatusLabel'
import { CategoryBreadcrumb } from '@/components/helpers/CategoryBreadcrumb'
import { Category } from '@/api/types/categories'
import SellerNameCell from '@/components/helpers/SellerNameCell'

export function useLiveAuctionsTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<HallItem>[]>(() => {
        return [
            // 1 — Item (product title + id)
            {
                header: t('liveAuctions.table.columns.item'),
                accessorKey: 'product',
                cell: ({ row }) => (
                    <TwoLineText
                        imageSize="sm"
                        title={row.original.product?.title ?? ''}
                        subtitle={`${t('liveAuctions.table.idPrefix')} ${row.original.product?.id ?? ''}`}
                        titleLabel={t('liveAuctions.table.columns.item')}
                        subtitleLabel={t('liveAuctions.table.idPrefix')}
                        size="sm"
                    />
                ),
            },
            // 2 — Seller (businessName + id)
            {
                header: t('liveAuctions.table.columns.seller'),
                accessorKey: 'seller',
                cell: ({ row }) => (
                    <SellerNameCell user={row.original.product?.user} />
                ),
            },
            // 3 — Hall (localised name)
            {
                header: t('liveAuctions.table.columns.hall'),
                accessorKey: 'hall',
                cell: ({ row }) => (
                    <Link to={`/halls/${row.original.hall?.id}`} className="hover:underline text-gray-950">{row.original.hall?.translations[0]?.name || t('halls.table.columns.noHallName')}</Link>
                ),
            },
            // 4 — Category (localised name)
            {
                header: t('liveAuctions.table.columns.category'),
                accessorKey: 'category',
                cell: ({ row }) => {
                    return (
                        <CategoryBreadcrumb category={row.original?.product?.category as Category} orientation="vertical" />
                    )
                },
            },
            // 5 — Status — same position
            {
                header: t('liveAuctions.table.columns.status'),
                accessorKey: 'status',
                cell: ({ row }) => (
                    <StatusPill
                        variant={getLiveAuctionStatusVariant(row.original.status)}
                        label={getLiveAuctionStatusLabel(row.original.status, t)}
                        size="sm"
                    />
                ),
            },
            // 6 — Created At
            {
                header: t('liveAuctions.table.columns.dateRange'),
                accessorKey: 'createdAt',
                cell: ({ row }) => {
                    const { date, time } = formatDateTime(row.original.createdAt)
                    return (
                        <TwoLineText title={date} subtitle={time} size="sm" />

                    )
                },
            },
            // 7 — Actions
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="w-[90px]">
                        <Button
                            size="md"
                            shape="circle"
                            variant="default"
                            onClick={() =>
                                navigate(`/live-auctions/${row.original.id}`)
                            }
                        >
                            {t('common.view') || 'View'}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
