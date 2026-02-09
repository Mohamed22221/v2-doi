import { TFunction } from "i18next"

export type SellerStatus = 'approved' | 'rejected' | 'pending'
export type AccountStatus = 'active' | 'suspended' | 'deleted'

/**
 * Returns the localized label for a seller's approval status
 */
export const getSellerStatusLabel = (t: TFunction, status?: SellerStatus) => {
    switch (status) {
        case 'approved': return t('fixedPrice.sellers.status.approved')
        case 'rejected': return t('fixedPrice.sellers.status.rejected')
        case 'pending': return t('fixedPrice.sellers.status.pending')
        default: return status
    }
}

/**
 * Returns the color variant for a seller's approval status pill
 */
export const getSellerStatusVariant = (status?: SellerStatus) => {
    switch (status) {
        case 'approved': return 'success'
        case 'rejected': return 'danger'
        case 'pending': return 'warning'
        default: return 'neutral'
    }
}

/**
 * Returns the localized label for a seller's account status
 */
export const getAccountStatusLabel = (t: TFunction, status?: AccountStatus) => {
    switch (status) {
        case 'active': return t('fixedPrice.sellers.status.active')
        case 'suspended': return t('fixedPrice.sellers.status.suspended')
        case 'deleted': return t('fixedPrice.sellers.status.deleted')
        default: return status
    }
}

/**
 * Returns the color variant for a seller's account status pill
 */
export const getAccountStatusVariant = (status?: AccountStatus) => {
    switch (status) {
        case 'active': return 'success'
        case 'suspended': return 'danger'
        case 'deleted': return 'neutral'
        default: return 'neutral'
    }
}
