import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Area } from '@/api/types/areas'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

/**
 * useAreasCsvColumns Hook
 * Defines the columns for the areas CSV export.
 */
export const useAreasCsvColumns = () => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language
    const isAr = currentLang === 'ar'

    return useMemo<CsvColumnDef<Area>[]>(
        () => [
            {
                header: t('locations.areas.table.columns.areaName') + ' (EN)',
                accessor: (row: Area) => row.name,
            },
            {
                header: t('locations.areas.table.columns.areaName') + ' (AR)',
                accessor: (row: Area) => row.nameAr,
            },
            {
                header: t('locations.areas.table.columns.city'),
                accessor: (row: Area) => {
                    const city = row?.city
                    return isAr ? (city?.nameAr || row.cityId) : (city?.name || row.cityId)
                },
            },
            {
                header: t('locations.areas.table.columns.region'),
                accessor: (row: Area) => {
                    const region = row?.city?.region
                    return isAr ? (region?.nameAr || '—') : (region?.name || '—')
                },
            },
            {
                header: t('locations.areas.table.columns.createdAt'),
                accessor: (row: Area) =>
                    row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString(currentLang)
                        : '—',
            },
        ],
        [t, currentLang, isAr]
    )
}
