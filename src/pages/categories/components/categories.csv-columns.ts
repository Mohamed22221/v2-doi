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
                    row.translations?.[0]?.name ?? row.slug,
            },
            {
                header: t('categories.table.columns.status'),
                accessor: (row: CategoryTableRow) =>
                    row.status === 'active'
                        ? t('common.active')
                        : t('common.inactive'),
            },
            {
                header: t('categories.table.filters.level'),
                accessor: (row: CategoryTableRow) => {
                    switch (row.level) {
                        case 1:
                            return t('categories.table.level.main')
                        case 2:
                            return t('categories.table.level.sub')
                        case 3:
                            return t('categories.table.level.nested')
                        default:
                            return ''
                    }
                },
            },
            {
                header: t('categories.table.columns.items'),
                accessor: (row: CategoryTableRow) => row.totalItems ?? 0,
            },
            {
                header: t('categories.table.columns.subCategories'),
                accessor: (row: CategoryTableRow) => row.children?.length ?? 0,
            },
        ],
        [t],
    )
}
