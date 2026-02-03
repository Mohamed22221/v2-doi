import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import { LiveAuctionItem } from '@/api/types/live-auctions'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { getLiveAuctionStatusLabel, getLiveAuctionStatusVariant } from './GetStatusLabel'

export function useLiveAuctionsTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<LiveAuctionItem>[]>(() => {
        return [
            {
                header: t('liveAuctions.table.columns.item'),
                accessorKey: 'name',
                cell: ({ row }) => (
                    <TwoLineText
                        imageSize="sm"
                        image={row.original.image}
                        title={row.original.name}
                        subtitle={`${t('liveAuctions.table.idPrefix')} ${row.original.id}`}
                        size="sm"
                    />
                ),
            },
            {
                header: t('liveAuctions.table.columns.seller'),
                accessorKey: 'seller',
            },
            {
                header: t('liveAuctions.table.columns.hall'),
                accessorKey: 'hall',
            },
            {
                header: t('liveAuctions.table.columns.category'),
                accessorKey: 'categoryParent',
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                            {row.original.categoryParent}
                        </span>
                        <span className="text-xs text-gray-500">
                            → {row.original.categoryChild}
                        </span>
                    </div>
                ),
            },
            {
                header: t('liveAuctions.table.columns.status'),
                accessorKey: 'status',
                cell: ({ row }) => (
                    <StatusPill
                        variant={getLiveAuctionStatusVariant(row.original.status)}
                        label={getLiveAuctionStatusLabel(row.original.status)}
                        size="sm"
                    />
                ),
            },
            {
                header: t('liveAuctions.table.columns.dateRange'),
                accessorKey: 'startDate',
                cell: ({ row }) => {
                    const { date: startDate, time: startTime } = formatDateTime(row.original.startDate)
                    const { date: endDate, time: endTime } = formatDateTime(row.original.endDate)

                    if (row.original.status === 'hidden' || row.original.status === 'rejected') {
                        return <span className="text-gray-400">—</span>
                    }

                    return (
                        <div className="flex flex-col text-[12px] ">
                            <span>{startDate} – {startTime}</span>
                            <span>{endDate} – {endTime}</span>
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
                            // size="sm"
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
