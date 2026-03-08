import { TFunction } from 'i18next'

export const getEffectiveStatusOptions = (
    t: TFunction,
    type: 'all' | 'fixedPrice' = 'all',
) => {
    const allOptions = [
        { label: t('fixedPrice.table.status.active'), value: 'active' },
        {
            label: t('fixedPrice.table.status.pendingReview'),
            value: 'pending_approval',
        },
        {
            label: t('fixedPrice.table.status.auctionScheduled'),
            value: 'auction_scheduled',
        },
        { label: t('fixedPrice.table.status.rejected'), value: 'rejected' },
        { label: t('fixedPrice.table.status.hidden'), value: 'hidden' },
        { label: t('fixedPrice.table.status.outOfStock'), value: 'sold' },
        { label: t('fixedPrice.table.status.draft'), value: 'draft' },
        { label: t('fixedPrice.table.status.inactive'), value: 'inactive' },
        {
            label: t('fixedPrice.table.status.auctionLive'),
            value: 'auction_live',
        },
        {
            label: t('fixedPrice.table.status.auctionEnded'),
            value: 'auction_ended',
        },
    ]

    if (type === 'fixedPrice') {
        return allOptions.filter(
            (opt) =>
                opt.value !== 'auction_live' &&
                opt.value !== 'auction_ended' &&
                opt.value !== 'auction_scheduled' &&
                opt.value !== 'draft' &&
                opt.value !== 'inactive',
        )
    }

    return allOptions
}
