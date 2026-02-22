import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'

// Components
import TwoLineText from '@/components/shared/table/TwoLineText'
import { Badge, Icon } from '@/components/ui'

// Utils & Types
import { formatDateTime } from '@/utils/formatDateTime'
import { Region } from '@/api/types/regions'
import Button from '@/components/ui/Button'

/**
 * useRegionsTableColumns Hook
 * Returns the column definitions for the Regions table.
 */
export function useRegionsTableColumns(
    onEdit: (region: Region) => void,
    onDelete: (region: Region) => void
) {
    const { t } = useTranslation()

    return useMemo<ColumnDef<Region>[]>(() => {
        return [
            {
                header: t('locations.regions.table.columns.regionName'),
                accessorKey: 'name',
                cell: ({ row }) => (
                    <TwoLineText title={row.original.name} subtitle={row.original.nameAr} size="sm" />

                ),
            },
            {
                header: t('locations.regions.table.columns.cities'),
                accessorKey: 'citiesCount',
                cell: ({ row }) => (
                    <Badge
                        content={row?.original?.citiesCount || 0}
                        className="bg-primary-50 dark:bg-primary-500 border-none"
                        innerClass="text-primary-500 dark:text-primary-50"
                    />
                )
            },
            {
                header: t('locations.regions.table.columns.createdAt'),
                accessorKey: 'createdAt',
                cell: ({ row }) => {
                    const { date, time } = formatDateTime(row.original.createdAt)
                    return (
                        <TwoLineText title={date} subtitle={time} size="sm" />
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-1">
                        <Button
                            size="sm"
                            variant="plain"
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(row.original)
                            }}

                        >
                            <Icon
                                name={'edit'}
                                className="w-[22px] h-[22px] text-primary-400 dark:text-primary-200"
                            />
                        </Button>
                        <Button
                            size="sm"
                            variant="plain"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(row.original)
                            }}
                        >
                            <Icon
                                name={'delete'}
                                className="w-[22px] h-[22px] text-primary-400 dark:text-primary-200"
                            />
                        </Button>
                    </div>
                ),
            },
        ]
    }, [t, onEdit, onDelete])
}
