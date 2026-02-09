import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import { DisputeItem } from '@/api/types/disputes'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { getStatusLabel, getStatusVariant } from './GetStatusLabel'

export function useDisputesTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<DisputeItem>[]>(() => {
        return [
            {
                header: t('disputes.table.columns.disputeId'),
                accessorKey: 'id',
                cell: ({ row }) => (
                    <span className="font-medium">{row.original.id}</span>
                ),
            },
            {
                header: t('disputes.table.columns.orderId'),
                accessorKey: 'orderId',
                cell: ({ row }) => (
                    <span className="font-medium">{row.original.orderId}</span>
                ),
            },
            {
                header: t('disputes.table.columns.buyer'),
                accessorKey: 'buyer',
                cell: ({ row }) => (
                    <TwoLineText
                        title={row.original.buyer.name}
                        subtitle={row.original.buyer.phone}
                        size="sm"
                    />
                ),
            },
            {
                header: t('disputes.table.columns.seller'),
                accessorKey: 'seller',
                cell: ({ row }) => (
                    <div className='w-[80px]'>
                        <span className="font-medium">{row.original.seller}</span>

                    </div>
                ),
            },
            {
                header: t('disputes.table.columns.reason'),
                accessorKey: 'reason',
            },
            {
                header: t('disputes.table.columns.disputeStatus'),
                accessorKey: 'status',
                cell: ({ row }) => (
                    <div className='w-[170px]'>
                        <StatusPill
                            variant={getStatusVariant(row.original.status)}
                            label={getStatusLabel(row.original.status)}
                            size="smxs"
                        />
                    </div>
                ),
            },
            {
                header: t('disputes.table.columns.openedAt'),
                accessorKey: 'openedAt',

                cell: ({ row }) => {
                    const { date, time } = formatDateTime(
                        row.original.openedAt,
                    )
                    return (
                        <div className="w-[75px]">
                            <TwoLineText title={date} subtitle={time} size="sm" />
                        </div>

                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="w-[90px]">
                        <Button
                            size="md"
                            variant="default"
                            onClick={() =>
                                navigate(`/disputes/${row.original.id}`)
                            }
                        >
                            {t('disputes.table.actions.view')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
