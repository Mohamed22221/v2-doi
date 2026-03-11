import { Category, LanguageCode } from './categories'

export type HallVisibilityStatus =
    | 'ACTIVE'
    | 'HIDDEN'
    | 'ARCHIVED'
    | 'SCHEDULED'
    | 'DRAFT'
    | 'ENDED'

// Legacy status type kept for backward compat with mock-based form
export type HallStatus = HallVisibilityStatus

export interface HallTranslation {
    languageCode: LanguageCode
    name: string
    description?: string
}

export interface HallTranslationDetail extends HallTranslation {
    id: string
    hallId: string
}

export interface MainHall {
    translations: HallTranslation[]
    coverImage?: string
    categoryIds: string[]
    regionId: string
    itemBiddingDurationSeconds?: number
    extensionSeconds: number
    visibilityStatus: HallVisibilityStatus
    scheduledStartTime?: string // ISO
    categories?: Category[]
    productIds?: string[]
}

export interface HallItemDetails extends MainHall {
    id: string
}

// Real API shape — list endpoint
export interface HallItem extends HallItemDetails {
    createdAt?: string
    itemsCount?: number
}
