import { FixedPriceStatus } from "@/api/types/fixed-price"
import { useTranslation } from "react-i18next"

export const getStatusLabel = (status?: FixedPriceStatus) => {
    const { t } = useTranslation()
    switch (status) {
        case 'active': return t('fixedPrice.table.status.active')
        case 'rejected': return t('fixedPrice.table.status.rejected')
        case 'hidden': return t('fixedPrice.table.status.hidden')
        case 'out_of_stock': return t('fixedPrice.table.status.outOfStock')
        case 'pending_review': return t('fixedPrice.table.status.pendingReview')
        default: return status
    }
}

export const getStatusVariant = (status?: FixedPriceStatus) => {
    switch (status) {
        case 'active': return 'success'
        case 'pending_review': return 'warning'
        case 'rejected': return 'danger'
        case 'hidden': return 'neutral'
        case 'out_of_stock': return 'neutral'
        default: return 'neutral'
    }
}
