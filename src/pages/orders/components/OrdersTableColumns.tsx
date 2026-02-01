import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import { Order } from '@/api/types/orders'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { getOrderStatusLabel, getOrderStatusVariant, getOrderTypeLabel, getPaymentStatusLabel, getPaymentStatusVariant } from './GetStatusLabel'

export function useOrdersTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()


    return useMemo<ColumnDef<Order>[]>(() => {
        return [
            {
                header: t('orders.table.columns.orderId'),
                accessorKey: 'id',
                cell: ({ row }) => (
                    <TwoLineText
                        title={row.original.id}
                        size="sm"
                    />
                ),
            },
            {
                header: t('orders.table.columns.type'),
                accessorKey: 'type',
                cell: ({ row }) => getOrderTypeLabel(row.original.type),
            },
            {
                header: t('orders.table.columns.buyer'),
                accessorKey: 'buyer',
                cell: ({ row }) => (
                    <TwoLineText
                        title={row.original.buyer}
                        subtitle={row.original.buyerPhone}
                        size="sm"
                    />
                ),
            },
            {
                header: t('orders.table.columns.seller'),
                accessorKey: 'seller',
            },
            {
                header: t('orders.table.columns.orderStatus'),
                accessorKey: 'orderStatus',
                cell: ({ row }) => (
                    <StatusPill
                        variant={getOrderStatusVariant(row.original.orderStatus)}
                        label={getOrderStatusLabel(row.original.orderStatus)}
                        size="sm"
                    />
                ),
            },
            {
                header: t('orders.table.columns.paymentStatus'),
                accessorKey: 'paymentStatus',
                cell: ({ row }) => (
                    <StatusPill
                        variant={getPaymentStatusVariant(row.original.paymentStatus)}
                        label={getPaymentStatusLabel(row.original.paymentStatus)}
                        size="sm"
                    />
                ),
            },
            {
                header: t('orders.table.columns.createdAt'),
                accessorKey: 'createdAt',
                cell: ({ row }) => {
                    const { date, time } = formatDateTime(
                        row.original.createdAt,
                    )
                    return (
                        <TwoLineText title={date} subtitle={time} size="sm" />
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="w-[120px]">
                        <Button
                            size="md"
                            variant="default"
                            onClick={() =>
                                navigate(`/orders/${row.original.id}`)
                            }
                        >
                            {t('orders.table.actions.viewDetails')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
