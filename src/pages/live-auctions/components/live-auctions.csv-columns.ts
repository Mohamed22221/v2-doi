import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HallItem } from '@/api/types/hall-auctions'
import { CsvColumnDef } from '@/utils/csv/csv.utils'
import { getLiveAuctionStatusLabel } from './GetStatusLabel'
import { formatDateTime } from '@/utils/formatDateTime'

/**
 * useLiveAuctionsCsvColumns Hook
 * Defines the columns for the live-auctions CSV export.
 */
export const useLiveAuctionsCsvColumns = () => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    return useMemo<CsvColumnDef<HallItem>[]>(
        () => [
            {
                header: t('liveAuctions.table.columns.item'),
                accessor: (row: HallItem) => row.product?.title || '—',
            },
            {
                header: t('liveAuctions.table.columns.seller'),
                accessor: (row: HallItem) =>
                    row.product?.user?.seller?.businessName || '—',
            },
            {
                header: t('liveAuctions.table.columns.hall'),
                accessor: (row: HallItem) => {
                    const translation = row.hall?.translations?.find(
                        (tr) => tr.languageCode.toLowerCase() === currentLang.toLowerCase()
                    )
                    return translation?.name || row.hall?.translations?.[0]?.name || '—'
                },
            },
            {
                header: t('liveAuctions.table.columns.category'),
                accessor: (row: HallItem) => {
                    const translation = row.product?.category?.translations?.find(
                        (tr) => tr.languageCode.toLowerCase() === currentLang.toLowerCase()
                    )
                    return translation?.name || row.product?.category?.translations?.[0]?.name || '—'
                },
            },
            {
                header: t('liveAuctions.table.columns.status'),
                accessor: (row: HallItem) => getLiveAuctionStatusLabel(row.status, t),
            },
            {
                header: t('liveAuctions.table.columns.dateRange'),
                accessor: (row: HallItem) => {
                    if (!row.createdAt) return '—'
                    const { date, time } = formatDateTime(row.createdAt)
                    return `${date} ${time}`
                },
            },
        ],
        [t, currentLang]
    )
}
