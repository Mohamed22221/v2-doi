import { useTranslation } from "react-i18next"

export type SellerStatus = 'approved' | 'rejected' | 'pending'

export const getSellerStatusLabel = (status?: SellerStatus) => {
    const { t } = useTranslation()
    switch (status) {
        case 'approved': return t('fixedPrice.sellers.status.approved')
        case 'rejected': return t('fixedPrice.sellers.status.rejected')
        case 'pending': return t('fixedPrice.sellers.status.pending')
        default: return status
    }
}

export const getSellerStatusVariant = (status?: SellerStatus) => {
    switch (status) {
        case 'approved': return 'success'
        case 'rejected': return 'danger'
        case 'pending': return 'warning'
        default: return 'neutral'
    }
}
