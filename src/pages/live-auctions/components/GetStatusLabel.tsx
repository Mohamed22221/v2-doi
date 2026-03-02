import { HallItemStatus } from "@/api/types/hall-auctions"
import type { TFunction } from "i18next"

export const getLiveAuctionStatusLabel = (
    status?: HallItemStatus,
    t?: TFunction,
): string => {
    if (!t) return status ?? ''
    switch (status) {
        case 'SCHEDULED': return t('halls.table.status.scheduled')
        case 'ACTIVE':    return t('halls.table.status.active')
        case 'ENDED':     return t('halls.table.status.ended')
        case 'REJECTED':  return t('halls.table.status.rejected')
        case 'CANCELLED': return t('halls.table.status.cancelled')
        case 'DRAFT':     return t('halls.table.status.draft')
        case 'HIDDEN':    return t('halls.table.status.hidden')
        case 'ARCHIVED':  return t('halls.table.status.archived')
        case 'SETTELD':   return t('halls.table.status.settled')
        default:          return status ?? ''
    }
}

export const getLiveAuctionStatusVariant = (
    status?: HallItemStatus,
): 'success' | 'warning' | 'neutral' | 'danger' | 'info' => {
    switch (status) {
        case 'ACTIVE':    return 'success'
        case 'SCHEDULED': return 'warning'
        case 'SETTELD':   return 'info'
        case 'REJECTED':  return 'danger'
        case 'CANCELLED': return 'danger'
        case 'DRAFT':     return 'neutral'
        case 'HIDDEN':    return 'neutral'
        case 'ARCHIVED':  return 'neutral'
        case 'ENDED':     return 'neutral'
        default:          return 'neutral'
    }
}
