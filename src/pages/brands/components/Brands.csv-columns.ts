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
                    row.translations.find(
                        (tr) => tr.languageCode.toLowerCase() === 'en',
                    )?.name ?? row.slug,
            },
            {
                header: t('brands.table.columns.status'),
                accessor: (row: BrandTableRow) => row.status,
            },
            {
                header: t('brands.table.columns.items'),
                accessor: (row: BrandTableRow) => row.itemsCount ?? 0,
            },
            {
                header: t('brands.logo'),
                accessor: (row: BrandTableRow) => row.logoUrl ?? '',
            },
        ],
        [t],
    )
}
