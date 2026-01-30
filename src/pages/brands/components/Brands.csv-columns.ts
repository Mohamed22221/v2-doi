import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { BrandTableRow } from '@/api/types/brands'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

export const useBrandCsvColumns = () => {
    const { t } = useTranslation()

    return useMemo<CsvColumnDef<BrandTableRow>[]>(
        () => [
            {
                header: t('brands.table.columns.brandName'),
                accessor: (row: BrandTableRow) =>
                    row.translations?.[0]?.name ?? row.slug,
            },
            {
                header: t('brands.table.columns.status'),
                accessor: (row: BrandTableRow) =>
                    row.status === 'active'
                        ? t('common.active')
                        : t('common.inactive'),
            },
            {
                header: t('brands.table.columns.items'),
                accessor: (row: BrandTableRow) => row.totalItems ?? 0,
            },

        ],
        [t],
    )
}
