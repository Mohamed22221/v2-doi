import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'

import {
    getSellerStatusLabel,
    getSellerStatusVariant
} from './GetSellerStatusLabel'

import { SellerItem } from '@/api/types/sellers'

/* -------- Hook that returns columns -------- */
export function useSellerTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<SellerItem>[]>(() => {
        return [
            {
                header: t('users.table.columns.name'),
                accessorKey: 'user.firstName',
                cell: ({ row }) => (
                    <TwoLineText
                        imageSize="sm"
                        image={row.original?.user?.image || undefined}
                        title={`${row.original?.user?.firstName} ${row.original?.user?.lastName}`}
                        subtitle={row.original?.user?.id}
                        subtitlePrefix={t('users.table.columns.idPrefix')}
                        size="sm"
                    />
                ),
            },
            {
                header: t('users.table.columns.email'),
                accessorKey: 'user.email',
                cell: ({ row }) => row.original?.user?.email,
            },
            {
                header: t('users.table.columns.phone'),
                accessorKey: 'user.phone',
                cell: ({ row }) => row.original?.user?.phone,
            },
            {
                header: t('users.table.columns.status'),
                accessorKey: 'approvalStatus',
                cell: ({ row }) => {
                    const status = row.original?.approvalStatus
                    return (
                        <StatusPill
                            variant={getSellerStatusVariant(status)}
                            label={getSellerStatusLabel(status)}
                            size="sm"
                        />
                    )
                },
            },
            {
                header: t('fixedPrice.sellers.columns.submitted'),
                accessorKey: 'user.createdAt',
                cell: ({ row }) => {
                    const { date, time } = formatDateTime(
                        row.original?.user?.createdAt,
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
                    <div className="w-[90px]">
                        <Button
                            size="md"
                            shape="circle"
                            onClick={() =>
                                navigate(`/sellers/${row.original?.user?.id}`)
                            }
                        >
                            {t('users.table.actions.view')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
