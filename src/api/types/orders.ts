
export type OrderType = 'live_auction' | 'fixed_price' | 'duration_auction'

export type OrderStatus = 'completed' | 'pending' | 'confirmed' | 'cancelled'

export type PaymentStatus = 'paid' | 'unpaid' | 'payment_held' | 'failed'

export interface Order {
    id: string
    type: OrderType
    buyer: string
    buyerPhone: string
    seller: string
    orderStatus: OrderStatus
    paymentStatus: PaymentStatus
    createdAt: string
}

export interface OrderDetails extends Order {
    itemTotalAmount: number
    shippingFees: number
    totalAmount: number
    buyerDetails: {
        id: string
        name: string
        phone: string
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
    }[]
}

export interface OrderResponse {
    items: Order[]
    total: number
}
