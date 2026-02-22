import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'

// Components
import TwoLineText from '@/components/shared/table/TwoLineText'
import { Badge, Icon, Button } from '@/components/ui'

// Utils & Types
import { formatDateTime } from '@/utils/formatDateTime'
import { City } from '@/api/types/cities'

/**
 * useCitiesTableColumns Hook
 * Returns the column definitions for the Cities table.
 */
export function useCitiesTableColumns(
    onEdit: (city: City) => void,
    onDelete: (city: City) => void
) {
    const { t, i18n } = useTranslation()
    const isAr = i18n.language === 'ar'

    return useMemo<ColumnDef<City>[]>(() => {
        return [
            {
                header: t('locations.cities.table.columns.cityName'),
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
                header: t('locations.cities.table.columns.region'),
                accessorKey: 'regionId',
                cell: ({ row }) => {
                    const region = row?.original?.region
                    const regionName = isAr ? region?.nameAr : region?.name
                    return (
                        <Badge
                            content={regionName || row.original.regionId}
                            className="bg-primary-50 dark:bg-primary-500 border-none"
                            innerClass="text-primary-500 dark:text-primary-50"
                        />
                    )
                }
            },
            {
                header: t('locations.cities.table.columns.areas'),
                accessorKey: 'areas',
                cell: ({ row }) => {
                    return (
                        <Badge
                            content={row.original.areasCount || 0}
                            className="bg-primary-50 dark:bg-primary-500 border-none"
                            innerClass="text-primary-500 dark:text-primary-50"
                        />
                    )
                }
            },
            {
                header: t('locations.cities.table.columns.createdAt'),
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
