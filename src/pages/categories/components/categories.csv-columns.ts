import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { CategoryTableRow } from '@/api/types/categories'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

export const useCategoryCsvColumns = () => {
    const { t } = useTranslation()

    return useMemo<CsvColumnDef<CategoryTableRow>[]>(
        () => [
            {
                header: t('categories.table.columns.categoryName'),
                accessor: (row: CategoryTableRow) =>
                    row.translations.find(
                        (tr: { languageCode: string; value: string }) =>
                            tr.languageCode.toLowerCase() === 'en',
                    )?.value ?? row.slug,
            },
            {
                header: t('categories.table.columns.status'),
                accessor: (row: CategoryTableRow) => row.status,
            },
            {
                header: t('categories.table.columns.items'),
                accessor: (row: CategoryTableRow) => row.itemsCount,
            },
            {
                header: t('categories.table.columns.subCategories'),
                accessor: (row: CategoryTableRow) => row.children?.length ?? 0,
            },
        ],
        [t],
    )
}
