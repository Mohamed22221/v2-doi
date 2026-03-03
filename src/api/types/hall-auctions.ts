import { BaseEntity } from './common'
import { Category } from './categories'
import {
    EffectiveStatus,
    ProductStatus,
} from './products'
import { UserItem } from './users'
import {  SellerItem } from './sellers'

// =============================================================================
// Status Types
// =============================================================================

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
    | 'SETTLED'

// =============================================================================
// API List Shapes (GET /api/v1/admin/hall-items)
// =============================================================================

export interface HallItemTranslation {
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    id: string
    languageCode: string
    name: string
    description?: string
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

// =============================================================================
// Auction Specific Shapes
// =============================================================================

export interface HallAuctionItem {
    id: string
    status: HallAuctionStatus
    scheduledAt?: string
    startedAt?: string
    createdAt?: string
    endedAt?: string
    product: {
        id: string
        title: string
        user?: {
            id: string
            firstName?: string
            lastName?: string
            seller?: {
                businessName?: string
            }
        }
        category?: Category
    }
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
    product: {
        id: string
        nameEn?: string
        nameAr?: string
        image?: string
        user?: {
            id: string
            name?: string
        }
    }
    auctionStartingPriceIncVat: number
    images?: { url: string }[]
    effectiveStatus: EffectiveStatus
}

export interface AssignItemsToHallPayload {
    productIds: string[]
}

// =============================================================================
// API Detail Shapes (GET /api/v1/admin/hall-items/item/{id})
// =============================================================================

export interface ActivityLogItem {
    item: string
    createdAt: string
    reason?: string
}

/** Hall shape nested inside HallItemDetails */
export interface HallItemDetailsHall extends BaseEntity {
    translations: HallItemTranslation[]
}

/** User shape nested inside HallItemDetailsProduct */
export interface HallItemDetailsProductUser extends UserItem {
    seller: SellerItem
}

/** Category shape nested inside HallItemDetailsProduct */
export interface HallItemDetailsCategory {
    translations: HallItemTranslation[]
    name?: string
}

/** Full product shape returned by GET /api/v1/admin/hall-items/item/{id} */
export interface HallItemDetailsProduct extends BaseEntity {
    title: string
    description: string
    user: HallItemDetailsProductUser
    category: HallItemDetailsCategory
    images: { url: string }[]
    quantity: number
    status: ProductStatus
    defects: string | null
    auctionStartingPriceIncVat: string | null
    auctionCurrentPriceIncVat: string | null
    auctionEndAt: string | null
}

/**
 * Full detail shape returned by GET /api/v1/admin/hall-items/item/{id}.
 * Matches the exact real API sample.
 */
export interface HallItemDetails extends BaseEntity {
    hall: HallItemDetailsHall
    product: HallItemDetailsProduct
    status: HallItemStatus
    startedAt: string | null
    endedAt: string | null
    winnerUserId: string | null
    activityLogs: ActivityLogItem[]
}

// =============================================================================
// Mutation Payloads
// =============================================================================

export interface RejectHallItemPayload {
    rejectReason: string
}

export interface HideHallItemPayload {
    hiddenReason: string
}

