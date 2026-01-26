import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ModelTableRow } from '@/api/types/models'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

export const useModelCsvColumns = () => {
    const { t } = useTranslation()

    return useMemo<CsvColumnDef<ModelTableRow>[]>(
        () => [
            {
                header: t('models.table.columns.modelName'),
                accessor: (row: ModelTableRow) => row.name,
            },
            {
                header: t('models.table.columns.brand'),
                accessor: (row: ModelTableRow) => row.brandId,
            },
            {
                header: t('models.table.columns.category'),
                accessor: (row: ModelTableRow) => row.categoryId,
            },
            {
                header: t('models.table.columns.releaseYear'),
                accessor: (row: ModelTableRow) => row.releaseYear,
            },
            {
                header: t('models.table.columns.sortOrder'),
                accessor: (row: ModelTableRow) => row.sortOrder,
            },
        ],
        [t],
    )
}
