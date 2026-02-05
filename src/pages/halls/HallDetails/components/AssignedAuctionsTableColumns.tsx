import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import { AssignedAuctionItem } from '@/api/types/halls'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { getLiveAuctionStatusLabel, getLiveAuctionStatusVariant } from '../../../live-auctions/components/GetStatusLabel'

export function useAssignedAuctionsTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<AssignedAuctionItem>[]>(() => {
        return [
            {
                header: t('halls.details.table.columns.item'),
                accessorKey: 'itemName',
                cell: ({ row }) => (
                    <TwoLineText
                        title={row.original.itemName}
                        subtitle={`${t('halls.details.table.columns.idPrefix')} ${row.original.id}`}
                        size="sm"
                    />
                ),
            },
            {
                header: t('halls.details.table.columns.seller'),
                accessorKey: 'sellerName',
            },
            {
                header: t('halls.details.table.columns.category'),
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
                header: t('halls.details.table.columns.status'),
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
                header: t('halls.details.table.columns.dateRange'),
                accessorKey: 'startDate',
                cell: ({ row }) => {
                    const { date: startDate, time: startTime } = formatDateTime(row.original.startDate)
                    // If no date range, return dash as in screenshot
                    if (!row.original.startDate || row.original.status === 'hidden' || row.original.status === 'rejected') {
                        return <span className="text-gray-400">—</span>
                    }

                    return (
                        <div className="flex flex-col text-[12px] text-gray-700 dark:text-gray-300">
                            <span>{startDate} – {startTime}</span>
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
                            onClick={() =>
                                navigate(`/live-auctions/${row.original.id}`)
                            }
                        >
                            {t('halls.actions.view')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
