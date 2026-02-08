import { useTranslation } from "react-i18next"

export type SellerStatus = 'approved' | 'rejected' | 'pending'
export type AccountStatus = 'active' | 'suspended' | 'deleted'

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

export const getAccountStatusLabel = (status?: AccountStatus) => {
    const { t } = useTranslation()
    switch (status) {
        case 'active': return t('fixedPrice.sellers.status.active')
        case 'suspended': return t('fixedPrice.sellers.status.suspended')
        case 'deleted': return t('fixedPrice.sellers.status.deleted')
        default: return status
    }
}

export const getAccountStatusVariant = (status?: AccountStatus) => {
    switch (status) {
        case 'active': return 'success'
        case 'suspended': return 'danger'
        case 'deleted': return 'neutral'
        default: return 'neutral'
    }
}
