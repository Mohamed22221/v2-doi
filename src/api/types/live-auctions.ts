
export type LiveAuctionStatus = 'live' | 'scheduled' | 'hidden' | 'ended' | 'rejected'

export interface LiveAuctionItem {
    id: string
    name: string
    seller: string
    hall: string
    categoryParent: string
    categoryChild: string
    status: LiveAuctionStatus
    startDate: string
    endDate: string
    image?: string
}

export interface LiveAuctionItemDetails extends LiveAuctionItem {
    description: string
    startingPrice: number
    availableQuantity: number
    finalPrice?: number
    winner?: {
        id: string
        name: string
    }
    currentHighestBid?: number
    mediaAssets: string[]
    sellerDetails: {
        id: string
        name: string
        phone: string
        status: 'active' | 'inactive'
    }
    activityLog: {
        item: string
        createdAt: string
        reason?: string
    }[]
}

export interface LiveAuctionResponse {
    items: LiveAuctionItem[]
    total: number
}
