import { Order, OrderDetails } from '@/api/types/orders'

export const ORDERS_MOCK: Order[] = Array.from({ length: 1250 }).map((_, index) => {
    const types: Order['type'][] = ['live_auction', 'fixed_price', 'duration_auction']
    const orderStatuses: Order['orderStatus'][] = ['completed', 'pending', 'confirmed', 'cancelled']
    const paymentStatuses: Order['paymentStatus'][] = ['paid', 'unpaid', 'payment_held', 'failed']

    const type = types[index % types.length]
    const orderStatus = orderStatuses[index % orderStatuses.length]
    const paymentStatus = paymentStatuses[index % paymentStatuses.length]
    const id = `OR-${50000 + index}`

    const buyers = ['Khaled A.', 'Sara K.', 'Ahmed O.', 'Huda SH.', 'Yassin E.']
    const sellers = ['TimeHouse', 'Elite Scents', 'Heritage Market', 'ProGamers', 'SmartTech Store', 'HomePlus']

    return {
        id,
        type,
        buyer: buyers[index % buyers.length],
        buyerPhone: '+966 xxxxxxxxx',
        seller: sellers[index % sellers.length],
        orderStatus,
        paymentStatus,
        createdAt: new Date(2025, 8, 23, 10, 45).toISOString(),
    }
})

export const getOrderDetailsById = (id: string): OrderDetails | undefined => {
    const order = ORDERS_MOCK.find(o => o.id === id)
    if (!order) return undefined

    const itemTotal = 2000
    const shipping = 50

    return {
        ...order,
        itemTotalAmount: itemTotal,
        shippingFees: shipping,
        totalAmount: itemTotal + shipping,
        buyerDetails: {
            id: 'BY-2231',
            name: order.buyer,
            phone: order.buyerPhone,
        },
        sellerDetails: {
            id: 'SL-2231',
            name: order.seller,
            phone: '+966 xxxxxxxxx',
            status: 'active'
        },
        activityLog: [
            {
                item: 'Order created',
                createdAt: order.createdAt,
            },
            {
                item: 'Payment successful',
                createdAt: order.createdAt,
            },
            {
                item: 'Order status updated',
                createdAt: order.createdAt,
            }
        ]
    }
}
