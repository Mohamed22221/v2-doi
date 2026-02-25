export type HallVisibilityStatus = 'ACTIVE' | 'HIDDEN' | 'ARCHIVED'

// Legacy status type kept for backward compat with mock-based form
export type HallStatus = HallVisibilityStatus

export interface HallItemDetails {
    id: string
    nameEn: string
    nameAr: string
    descriptionEn?: string
    descriptionAr?: string
    visibilityStatus: HallVisibilityStatus
}

// Real API shape — list endpoint
export interface HallItem extends HallItemDetails {
    createdAt?: string
    itemsCount?: number
}

export interface HallPayload {
    nameEn: string
    nameAr: string
    visibilityStatus: HallVisibilityStatus
    categoryId?: string
    sortOrder?: number
    status?: HallVisibilityStatus
}

