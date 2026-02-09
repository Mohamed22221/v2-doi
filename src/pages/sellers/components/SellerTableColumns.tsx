import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'

// UI Components
import Button from '@/components/ui/Button'

// Shared Components
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'

// Utils & Helpers
import { formatDateTime } from '@/utils/formatDateTime'
import {
    getSellerStatusLabel,
    getSellerStatusVariant
} from './GetSellerStatusLabel'

// Types
import { SellerItem } from '@/api/types/sellers'

/**
 * Hook that returns the column definitions for the Seller table
 * Includes columns for: Name, Email, Phone, Status, and Submission Date
 */
export function useSellerTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<SellerItem>[]>(() => {
        return [
            {
                header: t('sellers.table.columns.name'),
                accessorKey: 'user.firstName',
                cell: ({ row }) => (
                    <TwoLineText
                        imageSize="sm"
                        image={row.original?.user?.image || undefined}
                        title={`${row.original?.user?.firstName} ${row.original?.user?.lastName}`}
                        subtitle={row.original?.user?.id}
                        subtitlePrefix={t('sellers.table.columns.idPrefix')}
                        size="sm"
                    />
                ),
            },
            {
                header: t('sellers.table.columns.email'),
                accessorKey: 'user.email',
                cell: ({ row }) => row.original?.user?.email,
            },
            {
                header: t('sellers.table.columns.phone'),
                accessorKey: 'user.phone',
                cell: ({ row }) => row.original?.user?.phone,
            },
            {
                header: t('sellers.table.columns.status'),
                accessorKey: 'approvalStatus',
                cell: ({ row }) => {
                    const status = row.original?.approvalStatus
                    return (
                        <StatusPill
                            variant={getSellerStatusVariant(status)}
                            label={getSellerStatusLabel(t, status)}
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
                            {t('sellers.table.actions.view')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
