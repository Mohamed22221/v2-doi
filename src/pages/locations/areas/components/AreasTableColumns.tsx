import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'

// Components
import TwoLineText from '@/components/shared/table/TwoLineText'
import { Badge, Icon, Button } from '@/components/ui'

// Utils & Types
import { formatDateTime } from '@/utils/formatDateTime'
import { Area } from '@/api/types/areas'

/**
 * useAreasTableColumns Hook
 * Returns the column definitions for the Areas table.
 */
export function useAreasTableColumns(
    onEdit: (area: Area) => void,
    onDelete: (area: Area) => void
) {
    const { t, i18n } = useTranslation()
    const isAr = i18n.language === 'ar'

    return useMemo<ColumnDef<Area>[]>(() => {
        return [
            {
                header: t('locations.areas.table.columns.areaName'),
                accessorKey: 'name',
                cell: ({ row }) => (
                    <TwoLineText
                        title={row.original.name}
                        subtitle={row.original.nameAr}
                        size="sm"
                    />
                ),
            },
            {
                header: t('locations.areas.table.columns.city'),
                accessorKey: 'cityId',
                cell: ({ row }) => {
                    const cityName = isAr ? row.original.cityNameAr : row.original.cityName
                    return (
                        <Badge
                            content={cityName || row.original.cityId}
                            className="bg-primary-50 dark:bg-primary-500 border-none"
                            innerClass="text-primary-500 dark:text-primary-50"
                        />
                    )
                }
            },
            {
                header: t('locations.areas.table.columns.region'),
                accessorKey: 'regionName',
                cell: ({ row }) => {
                    const regionName = isAr ? row.original.regionNameAr : row.original.regionName
                    return (
                        <Badge
                            content={regionName || '-'}
                            className="bg-primary-50 dark:bg-primary-500 border-none"
                            innerClass="text-primary-500 dark:text-primary-50"
                        />
                    )
                }
            },
            {
                header: t('locations.areas.table.columns.createdAt'),
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
    }, [t, onEdit, onDelete, isAr])
}
