import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ModelTableRow } from '@/api/types/models'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

export const useModelCsvColumns = () => {
    const { t, i18n } = useTranslation()

    return useMemo<CsvColumnDef<ModelTableRow>[]>(
        () => [
            {
                header: t('models.table.columns.modelName'),
                accessor: (row: ModelTableRow) => row.name,
            },
            {
                header: t('models.table.columns.brand'),
                accessor: (row: ModelTableRow) => {
                    const lang = i18n.language.toLowerCase()
                    const translation = row.brand?.translations?.find(
                        (tr) => tr.languageCode.toLowerCase() === lang,
                    )
                    return translation?.name || row.brand?.slug || row.brandId
                },
            },
            {
                header: t('models.table.columns.category'),
                accessor: (row: ModelTableRow) => {
                    const lang = i18n.language.toLowerCase()
                    const translation = row.category?.translations?.find(
                        (tr) => tr.languageCode.toLowerCase() === lang,
                    )
                    return (
                        translation?.name ||
                        row.category?.slug ||
                        row.categoryId
                    )
                },
            },
            {
                header: t('models.table.columns.releaseYear'),
                accessor: (row: ModelTableRow) => row.releaseYear,
            },
        ],
        [t, i18n],
    )
}
