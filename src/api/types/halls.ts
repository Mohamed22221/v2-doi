export type HallVisibilityStatus = 'ACTIVE' | 'HIDDEN' | 'ARCHIVED' | 'DRAFT'

// Legacy status type kept for backward compat with mock-based form
export type HallStatus = HallVisibilityStatus

export interface HallItemDetails {
    id: string
    nameEn: string
    nameAr: string
    descriptionEn?: string
    descriptionAr?: string
    visibilityStatus: HallVisibilityStatus
    regionId?: string
    image?: string
    title?: string
    region?: {
        id: string
        name: string
        nameAr: string
    }
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
    regionId?: string
    sortOrder?: number
    status?: HallVisibilityStatus
}

