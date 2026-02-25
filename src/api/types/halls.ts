export type HallVisibilityStatus = 'ACTIVE' | 'HIDDEN' | 'ARCHIVED'

// Legacy status type kept for backward compat with mock-based form
export type HallStatus = HallVisibilityStatus



// Real API shape — list endpoint
export interface HallItem {
    id: string
    createdAt: string
    nameEn: string
    nameAr: string
    visibilityStatus: HallVisibilityStatus
    status?: HallVisibilityStatus
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

export interface HallTranslation {
    languageCode: string
    name: string
    description?: string
}

export interface AssignedAuctionItem {
    id: string
    itemName: string
    itemCode: string
    sellerName: string
    categoryParent: string
    categoryChild: string
    status: 'live' | 'scheduled' | 'hidden' | 'ended' | 'rejected'
    startDate: string
    endDate: string
}

export interface AssignableAuction {
    id: string
    title: string
    auctionCode: string
    sellerName: string
    status: string
    category: string
    date?: string
    startingBid: number
    currency: string
    imageUrl: string
}
