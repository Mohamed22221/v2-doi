import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { City } from '@/api/types/cities'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

/**
 * useCitiesCsvColumns Hook
 * Defines the columns for the cities CSV export.
 */
export const useCitiesCsvColumns = () => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language
    const isAr = currentLang === 'ar'

    return useMemo<CsvColumnDef<City>[]>(
        () => [
            {
                header: t('locations.cities.table.columns.cityName') + ' (EN)',
                accessor: (row: City) => row.name,
            },
            {
                header: t('locations.cities.table.columns.cityName') + ' (AR)',
                accessor: (row: City) => row.nameAr,
            },
            {
                header: t('locations.cities.table.columns.region'),
                accessor: (row: City) => {
                    const region = row?.region
                    return isAr ? (region?.nameAr || row.regionId) : (region?.name || row.regionId)
                },
            },
            {
                header: t('locations.cities.table.columns.areas'),
                accessor: (row: City) => row.areasCount || 0,
            },
            {
                header: t('locations.cities.table.columns.createdAt'),
                accessor: (row: City) =>
                    row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString(currentLang)
                        : '—',
            },
        ],
        [t, currentLang, isAr]
    )
}
