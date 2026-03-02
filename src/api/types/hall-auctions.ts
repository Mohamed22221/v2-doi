import { BaseEntity } from './common'
import { Category } from "./categories"
import { EffectiveStatus, ProductStatus, SellType, ProductBusinessStatus, PublishStatus } from "./products"
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
    | 'SETTLED'

// ---------------------------------------------------------------------------
// Hall Items API shapes  (GET /api/v1/admin/hall-items)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Hall Item Detail types  (GET /api/v1/admin/hall-items/item/{id})
// ---------------------------------------------------------------------------

/** Hall shape nested inside HallItemDetails */
export interface HallItemDetailsHall extends BaseEntity {
    translations: HallItemTranslation[]
    coverImage: string | null
    categories: Category[]
    regionId: string
    cityId: string | null
    areaId: string | null
    visibilityStatus: string
    hiddenReason: string | null
    archiveReason: string | null
    itemBiddingDurationSeconds: number
    extensionSeconds: number
    allowAutoExtension: boolean
    currentItemId: string | null
    scheduledStartTime: string | null
    name: string
    description: string
}

/** Seller shape nested inside HallItemDetailsProductUser */
export interface HallItemDetailsSeller extends BaseEntity {
    businessDescription: string | null
    businessName: string | null
    businessPhone: string | null
    businessAddress: string | null
    commercialRegistrationNumber: string | null
    nationalIdNumber: string | null
    approvalStatus: string
    accountStatus: string
    reason: string | null
    verifiedAt: string | null
    documents: unknown[]
}

/** User shape nested inside HallItemDetailsProduct */
export interface HallItemDetailsProductUser extends BaseEntity {
    firstName: string
    lastName: string
    email: string
    phone: string
    roleId: number
    isActive: boolean
    failedLoginAttempts: number
    lastLogin: string | null
    lastPasswordChange: string
    image: string | null
    isPhoneVerified: boolean
    isEmailVerified: boolean
    language: string
    seller: HallItemDetailsSeller | null
}

/** Category shape nested inside HallItemDetailsProduct */
export interface HallItemDetailsCategory extends BaseEntity {
    parentId: string | null
    translations: HallItemTranslation[]
    level: number
    slug: string
    status: string
    sortOrder: number
    image: string | null
    name: string
}

/** Dimensions shape nested inside HallItemDetailsProduct */
export interface HallItemDetailsDimensions {
    width: number
    height: number
    length: number
    weight: number
}

/** Pickup location shape nested inside HallItemDetailsProduct */
export interface HallItemDetailsPickupLocation {
    type: string
    coordinates: [number, number]
}

/** Full product shape returned by GET /api/v1/admin/hall-items/item/{id} */
export interface HallItemDetailsProduct extends BaseEntity {
    title: string
    slug: string
    description: string
    price: string | null
    userId: string
    user: HallItemDetailsProductUser
    categoryId: string
    category: HallItemDetailsCategory
    brandId: string | null
    modelId: string | null
    images: unknown[]
    parentId: string | null
    isBundle: boolean
    regionId: string | null
    cityId: string | null
    areaId: string | null
    pickupLocation: HallItemDetailsPickupLocation | null
    size: string
    dimensions: HallItemDetailsDimensions | null
    quantity: number
    quantityUnit: string | null
    status: ProductStatus
    moderationStatus: string
    rejectionReason: string | null
    hiddenReason: string | null
    businessStatus: ProductBusinessStatus
    publishStatus: PublishStatus
    productSellType: SellType
    conditionPercentage: number
    defects: string | null
    isNegotiable: boolean
    needsRepair: boolean
    pickupAddress: string
    manufacturingDate: string
    auctionStartingPriceIncVat: string | null
    auctionMinBidIncrement: string | null
    auctionInstantBuyPriceIncVat: string | null
    auctionStartAt: string | null
    auctionDurationDays: number | null
    auctionStatus: string | null
    auctionEndAt: string | null
    auctionCurrentPriceIncVat: string | null
    auctionHighestBidderId: string | null
    isInActiveAuction: boolean
    effectiveStatus: EffectiveStatus
}

/**
 * Full detail shape returned by GET /api/v1/admin/hall-items/item/{id}.
 * Matches the exact real API sample.
 */
export interface HallItemDetails extends BaseEntity {
    hallId: string
    hall: HallItemDetailsHall
    productId: string
    product: HallItemDetailsProduct
    sortOrder: number
    status: HallItemStatus
    scheduledAt: string | null
    startedAt: string | null
    endedAt: string | null
    rejectionReason: string | null
    hiddenReason: string | null
    isForceEnded: boolean
    currentBidderId: string | null
    winnerUserId: string | null
    bidCount: number
    activityLogs: unknown[]
}

// ---------------------------------------------------------------------------
// Hall Item mutation payloads
// ---------------------------------------------------------------------------

export interface RejectHallItemPayload {
    rejectReason: string
}

export interface HideHallItemPayload {
    hiddenReason: string
}

export interface ReorderHallItemPayload {
    sortOrder: number
}
