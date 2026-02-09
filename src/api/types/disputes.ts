
export type DisputeStatus =
    | 'resolved-buyer'
    | 'resolved-seller'
    | 'resolved-compromise'
    | 'waiting-seller-response'
    | 'dispute-opened'
    | 'platform-mediation'

export interface DisputeBuyer {
    name: string
    phone: string
}

export interface DisputeItem {
    id: string
    orderId: string
    buyer: DisputeBuyer
    seller: string
    reason: string
    status: DisputeStatus
    openedAt: string
}

export interface DisputeItemDetails extends DisputeItem {
    description: string
    orderType: 'live-auction' | 'fixed-price' | 'duration-auction'
    heldAmount: number
    slaCounter: {
        days: number
        hours: number
        minutes: number
    }
    buyerMessage: string
    requestedOutcome: string
    orderSnapshot: {
        itemTotalAmount: number
        shippingFees: number
        vat: number
        totalAmount: number
    }
    orderAmount: number
    buyerDetails: {
        id: string
        name: string
        phone: string
        email: string
    }
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
    resolution?: {
        outcome: string
        reason: string
        resolvedAt?: string
        resolvedBy?: string
    }
}

export interface DisputeResponse {
    items: DisputeItem[]
    total: number
}
