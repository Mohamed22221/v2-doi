import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HallAuctionItem, HallAuctionStatus } from '@/api/types/hall-auctions'
import { CsvColumnDef } from '@/utils/csv/csv.utils'
import { getAuctionStatusLabel } from './AssignedAuctionsTableColumns'

export const useAssignedAuctionsCsvColumns = () => {
    const { t } = useTranslation()

    return useMemo<CsvColumnDef<HallAuctionItem>[]>(
        () => [
            {
                header: t('halls.details.table.columns.order', {
                    defaultValue: 'Order',
                }),
                accessor: (row: HallAuctionItem) => row.id || '', // Placeholder since index not supported
            },
            {
                header: t('halls.details.table.columns.item'),
                accessor: (row: HallAuctionItem) => row.product?.title || '',
            },
            {
                header: t('halls.details.table.columns.seller'),
                accessor: (row: HallAuctionItem) =>
                    row.product?.user?.firstName
                        ? `${row.product.user.firstName} ${row.product.user.lastName || ''}`.trim()
                        : '',
            },
            {
                header: t('halls.details.table.columns.status'),
                accessor: (row: HallAuctionItem) =>
                    getAuctionStatusLabel(row.status as HallAuctionStatus, t),
            },
            {
                header: t('liveAuctions.details.startingPrice'),
                accessor: (row: HallAuctionItem) =>
                    row.product?.auctionStartingPriceIncVat || '0',
            },
        ],
        [t],
    )
}
