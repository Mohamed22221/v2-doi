import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Product } from '@/api/types/products'
import { CsvColumnDef } from '@/utils/csv/csv.utils'
import { getStatusLabel } from './GetStatusLabel'

/**
 * useFixedPriceCsvColumns Hook
 * Defines the columns for the fixed-price CSV export.
 */
export const useFixedPriceCsvColumns = () => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    return useMemo<CsvColumnDef<Product>[]>(
        () => [
            {
                header: t('fixedPrice.table.columns.item'),
                accessor: (row: Product) => row.title,
            },
            {
                header: t('fixedPrice.table.columns.seller'),
                accessor: (row: Product) =>
                    row.user
                        ? `${row.user.firstName} ${row.user.lastName}`
                        : '—',
            },
            {
                header: t('fixedPrice.table.columns.category'),
                accessor: (row: Product) => {

                    const translation = row.category?.translations?.find(
                        (tr) => tr.languageCode === currentLang
                    )
                    return translation?.name || row.category?.slug || '—'
                },
            },
            {
                header: t('fixedPrice.table.columns.price'),
                accessor: (row: Product) =>
                    row.price ? `${row.price} ${t('common.currency')}` : '—',
            },
            {
                header: t('fixedPrice.table.columns.status'),
                accessor: (row: Product) => getStatusLabel(row.effectiveStatus, t),
            },
            {
                header: t('fixedPrice.table.columns.createdAt'),
                accessor: (row: Product) =>
                    row.createdAt
                        ? new Date(row.createdAt).toLocaleDateString(currentLang)
                        : '—',
            },
        ],
        [t, currentLang]
    )
}
