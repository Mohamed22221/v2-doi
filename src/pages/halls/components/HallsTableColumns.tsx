import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import { HallItem } from '@/api/types/halls'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { getStatusLabel, getStatusVariant } from './GetStatusLabel'
import Badge from '@/components/ui/Badge'

export function useHallsTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<HallItem>[]>(() => {

        return [
            {
                header: t('halls.table.columns.hallName'),
                accessorKey: 'translations',
                cell: ({ row }) => {
                    const name =
                        row.original.translations?.[0]?.name
                    return (
                        <TwoLineText
                            title={name}
                            subtitle={t('users.table.columns.idPrefix') + ' ' + row.original?.id}
                            titleLabel={t('halls.table.columns.hallName')}
                            size="sm"
                        />
                    )
                }
            },
            {
                header: t('halls.table.columns.status'),
                accessorKey: 'visibilityStatus',
                cell: ({ row }) => (
                    <StatusPill
                        variant={getStatusVariant(row.original?.visibilityStatus)}
                        label={getStatusLabel(row.original?.visibilityStatus)}
                        size="sm"
                    />
                ),
            },
            {
                header: t('halls.table.columns.assigned'),
                accessorKey: 'itemsCount',
                cell: ({ row }) => (
                    <Badge
                        content={row.original?.itemsCount}
                        className="bg-primary-50 dark:bg-primary-500 border-none"
                        innerClass="text-primary-500 dark:text-primary-50"
                    />
                ),
            },
            {
                header: t('halls.table.columns.createdAt'),
                accessorKey: 'createdAt',
                cell: ({ row }) => {
                    const { date, time } = formatDateTime(
                        row.original.createdAt ?? '',
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
                            variant="default"
                            onClick={() =>
                                navigate(`/halls/${row.original.id}`)
                            }
                        >
                            {t('common.view')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
