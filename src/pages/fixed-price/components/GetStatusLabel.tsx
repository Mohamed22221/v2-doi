import { EffectiveStatus } from "@/api/types/products"
import { TFunction } from "i18next"

/**
 * Returns the translated label for a given product status.
 * @param status - The effective status of the product.
 * @param t - The translation function from useTranslation.
 * @returns The translated status string or the status itself if no match is found.
 */
export const getStatusLabel = (status: EffectiveStatus | undefined, t: TFunction) => {
    switch (status) {
        case 'active':
            return t('fixedPrice.table.status.active')
        case 'rejected':
            return t('fixedPrice.table.status.rejected')
        case 'hidden':
            return t('fixedPrice.table.status.hidden')
        case 'sold':
            return t('fixedPrice.table.status.outOfStock')
        case 'pending_approval':
            return t('fixedPrice.table.status.pendingReview')
        case 'auction_scheduled':
            return t('fixedPrice.table.status.auctionScheduled')
        case 'auction_live':
            return t('fixedPrice.table.status.auctionLive')
        case 'auction_ended':
            return t('fixedPrice.table.status.auctionEnded')
        case 'inactive':
            return t('fixedPrice.table.status.inactive')
        case 'draft':
            return t('fixedPrice.table.status.draft')
        default:
            return status ?? ''
    }
}

/**
 * Returns the visual variant (color) for a given product status.
 * @param status - The effective status of the product.
 * @returns A string representing the status variant (success, warning, danger, neutral).
 */
export const getStatusVariant = (status?: EffectiveStatus) => {
    switch (status) {
        case 'active':
        case 'auction_live':
            return 'success'

        case 'pending_approval':
        case 'auction_scheduled':
            return 'warning'
        case 'rejected':
        case 'inactive':
            return 'danger'
        case 'hidden':
        case 'sold':
        case 'draft':
        case 'auction_ended':
            return 'neutral'
        default:
            return 'neutral'
    }
}

