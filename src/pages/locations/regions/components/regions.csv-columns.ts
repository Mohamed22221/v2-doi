import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Region } from '@/api/types/regions'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

/**
 * useRegionsCsvColumns Hook
 * Defines the columns for the regions CSV export.
 */
export const useRegionsCsvColumns = () => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    return useMemo<CsvColumnDef<Region>[]>(
        () => [
            {
                header: t('locations.regions.table.columns.regionName'),
                accessor: (row: Region) => row.name,
            },
            {
                header: t('locations.regions.table.columns.nameAr'),
                accessor: (row: Region) => row.nameAr,
            },
            {
                header: t('locations.regions.table.columns.cities'),
                accessor: (row: Region) => row.cities?.length || 0,
            },
            {
                header: t('locations.regions.table.columns.createdAt'),
                accessor: (row: Region) =>
                    row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString(currentLang)
                        : '—',
            },
        ],
        [t, currentLang]
    )
}
