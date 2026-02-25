import { Category } from "./categories"

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

export interface HallAuctionItem {
    id: string
    status: HallAuctionStatus
    scheduledAt?: string
    startedAt?: string
    endedAt?: string
    product: HallAuctionProduct
}
