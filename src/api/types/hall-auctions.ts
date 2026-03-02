import { Category } from "./categories"
import { EffectiveStatus } from "./products"
import { UserItem } from "./users"

export type HallAuctionStatus =
    | 'LIVE'
    | 'SCHEDULED'
    | 'REJECTED'
    | 'HIDDEN'
    | 'ENDED'
    | 'CANCELLED'

/**
 * Full status enum for hall items returned by GET /api/v1/admin/hall-items.
 * Superset of HallAuctionStatus — used exclusively for the Hall Items table.
 */
export type HallItemStatus =
    | 'SCHEDULED'
    | 'ACTIVE'
    | 'ENDED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'DRAFT'
    | 'HIDDEN'
    | 'ARCHIVED'
    | 'SETTELD'

// ---------------------------------------------------------------------------
// Hall Items API shapes  (GET /api/v1/admin/hall-items)
// ---------------------------------------------------------------------------

export interface HallItemTranslation {
    languageCode: string
    name: string
}

export interface HallItemSeller {
    id: string
    businessName?: string
}

export interface HallItemProductUser {
    id: string
    seller?: HallItemSeller
}

export interface HallItemProduct {
    id: string
    title: string
    user?: HallItemProductUser
    category?: {
        id: string
        translations: HallItemTranslation[]
    }
}

export interface HallItemHall {
    id: string
    translations: HallItemTranslation[]
}

/** Top-level item returned by GET /api/v1/admin/hall-items */
export interface HallItem {
    id: string
    status: HallItemStatus
    createdAt: string
    hall: HallItemHall
    product: HallItemProduct
}

/** Query params for GET /api/v1/admin/hall-items */
export interface HallItemsParams {
    page?: number
    limit?: number
    search?: string
    status?: HallItemStatus | null
    categoryId?: string | null
}


export interface HallAuctionUser {
    id: string
    firstName?: string
    lastName?: string
    businessName?: string
}

export interface HallAuctionProduct {
    id: string
    title: string
    user?: HallAuctionUser
    category?: Category
}

/** Extended product shape returned by the assignable auctions endpoint */
export interface AssignableAuctionProduct {
    id: string
    nameEn?: string
    nameAr?: string
    image?: string
    user?: {
        id: string
        name?: string
    }
}


export interface HallAuctionItem {
    id: string
    status: HallAuctionStatus
    scheduledAt?: string
    startedAt?: string
    createdAt?: string
    endedAt?: string
    product: HallAuctionProduct
}

/** Auction item shape returned by GET /api/v1/admin/hall-items/auctions */
export interface AssignableAuctionItem {
    id: string
    title: string
    user?: UserItem
    status: HallAuctionStatus
    auctionCode?: string
    startingBid?: number
    scheduledAt?: string
    startedAt?: string
    endedAt?: string
    product: AssignableAuctionProduct
    auctionStartingPriceIncVat: number
    images?: { url: string }[]
    effectiveStatus: EffectiveStatus

}

export interface AssignItemsToHallPayload {
    productIds: string[]
}
