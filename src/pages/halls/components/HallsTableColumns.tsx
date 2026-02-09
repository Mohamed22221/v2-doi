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
                accessorKey: 'name',
                cell: ({ row }) => (
                    <TwoLineText
                        title={row.original.name}
                        subtitle={row.original.code}
                        size="sm"
                    />
                ),
            },
            {
                header: t('halls.table.columns.status'),
                accessorKey: 'status',
                cell: ({ row }) => (
                    <StatusPill
                        variant={getStatusVariant(row.original.status)}
                        label={getStatusLabel(row.original.status)}
                        size="sm"
                    />
                ),
            },
            {
                header: t('halls.table.columns.assigned'),
                accessorKey: 'assignedCount',
                cell: ({ row }) => (
                    <Badge
                        content={row.original.assignedCount}
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
                    <div className="w-[120px] flex justify-end">
                        <Button
                            size="md"
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
