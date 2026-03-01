import { Category, LanguageCode } from './categories'

export type HallVisibilityStatus = 'ACTIVE' | 'HIDDEN' | 'ARCHIVED' | 'DRAFT'

// Legacy status type kept for backward compat with mock-based form
export type HallStatus = HallVisibilityStatus

export interface HallTranslation {
    languageCode: LanguageCode;
    name: string;
    description?: string;
}

export interface MainHall {
    translations: HallTranslation[]
    coverImage?: string
    categoryId: string
    regionId: string
    itemBiddingDurationSeconds: number
    extensionSeconds: number
    visibilityStatus: HallVisibilityStatus
    scheduledStartTime: string // ISO
}

export interface HallItemDetails extends MainHall {
    id: string
}

// Real API shape — list endpoint
export interface HallItem extends HallItemDetails {
    createdAt?: string
    itemsCount?: number
}

