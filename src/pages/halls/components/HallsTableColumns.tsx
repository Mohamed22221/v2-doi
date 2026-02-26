import { ColumnDef } from '@tanstack/react-table'
import { HiOutlinePencil } from 'react-icons/hi'
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
    const { t, i18n } = useTranslation()

    return useMemo<ColumnDef<HallItem>[]>(() => {
        const lang = i18n.language

        return [
            {
                header: t('halls.table.columns.hallName'),
                accessorKey: 'name',
                cell: ({ row }) => {
                    const name =
                        lang === 'ar'
                            ? row.original?.nameAr
                            : row.original?.nameEn
                    return (
                        <TwoLineText
                            title={name}
                            subtitle={row.original?.id}
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
                    <div className="w-[160px] flex justify-end gap-2">
                        <Button
                            size="md"
                            variant="default"
                            icon={<HiOutlinePencil />}
                            onClick={() =>
                                navigate(`/halls/${row.original.id}/edit`)
                            }
                        />
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
    }, [navigate, t, i18n.language])
}
