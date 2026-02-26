import { Category } from "./categories"
import { UserItem } from "./users"

export type HallAuctionStatus =
    | 'LIVE'
    | 'SCHEDULED'
    | 'REJECTED'
    | 'HIDDEN'
    | 'ENDED'
    | 'CANCELLED'


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
    image?: string
}

export interface AssignItemsToHallPayload {
    productIds: string[]
}
