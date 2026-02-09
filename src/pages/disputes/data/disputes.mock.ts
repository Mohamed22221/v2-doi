import { DisputeItem, DisputeItemDetails } from '@/api/types/disputes'

export const DISPUTES_MOCK: DisputeItem[] = [
    {
        id: 'DP-30011',
        orderId: 'OR-50088',
        buyer: {
            name: 'Khaled A.',
            phone: '(+966 XXXXXXX)'
        },
        seller: 'TimeHouse',
        reason: 'Item not as described',
        status: 'resolved-buyer',
        openedAt: new Date(2025, 8, 23, 10, 45).toISOString()
    },
    {
        id: 'DP-30012',
        orderId: 'OR-50089',
        buyer: {
            name: 'Sara K.',
            phone: '(+966 XXXXXXX)'
        },
        seller: 'Elite Scents',
        reason: 'Damaged / missing item',
        status: 'waiting-seller-response',
        openedAt: new Date(2025, 8, 23, 10, 45).toISOString()
    },
    {
        id: 'DP-30013',
        orderId: 'OR-50090',
        buyer: {
            name: 'Ahmed O.',
            phone: '(+966 XXXXXXX)'
        },
        seller: 'Heritage Market',
        reason: 'Late delivery',
        status: 'dispute-opened',
        openedAt: new Date(2025, 8, 23, 10, 45).toISOString()
    },
    {
        id: 'DP-30014',
        orderId: 'OR-50091',
        buyer: {
            name: 'Huda SH.',
            phone: '(+966 XXXXXXX)'
        },
        seller: 'ProGamers',
        reason: 'Item not received',
        status: 'platform-mediation',
        openedAt: new Date(2025, 8, 23, 10, 45).toISOString()
    },
    {
        id: 'DP-30015',
        orderId: 'OR-50092',
        buyer: {
            name: 'Yassin E.',
            phone: '(+966 XXXXXXX)'
        },
        seller: 'SmartTech Store',
        reason: 'Item not as described',
        status: 'resolved-seller',
        openedAt: new Date(2025, 8, 23, 10, 45).toISOString()
    },
    {
        id: 'DP-30016',
        orderId: 'OR-50092',
        buyer: {
            name: 'Yassin E.',
            phone: '(+966 XXXXXXX)'
        },
        seller: 'SmartTech Store',
        reason: 'Item not as described',
        status: 'resolved-compromise',
        openedAt: new Date(2025, 8, 23, 10, 45).toISOString()
    }
]

// Generate more mock data for pagination testing
export const DISPUTES_ITEMS_MOCK: DisputeItem[] = Array.from({ length: 1250 }).map((_, index) => {
    if (index < 6) {
        return DISPUTES_MOCK[index]
    }

    const statuses: DisputeItem['status'][] = [
        'resolved-buyer',
        'resolved-seller',
        'resolved-compromise',
        'waiting-seller-response',
        'dispute-opened',
        'platform-mediation'
    ]
    const status = statuses[index % statuses.length]
    const id = `DP-${30000 + index}`
    const orderId = `OR-${50000 + index}`

    const buyers = [
        { name: 'Khaled A.', phone: '(+966 XXXXXXX)' },
        { name: 'Sara K.', phone: '(+966 XXXXXXX)' },
        { name: 'Ahmed O.', phone: '(+966 XXXXXXX)' },
        { name: 'Huda SH.', phone: '(+966 XXXXXXX)' },
        { name: 'Yassin E.', phone: '(+966 XXXXXXX)' }
    ]

    const sellers = ['TimeHouse', 'Elite Scents', 'Heritage Market', 'ProGamers', 'SmartTech Store']
    const reasons = [
        'Item not as described',
        'Damaged / missing item',
        'Late delivery',
        'Item not received',
        'Wrong item delivered'
    ]

    return {
        id,
        orderId,
        buyer: buyers[index % buyers.length],
        seller: sellers[index % sellers.length],
        reason: reasons[index % reasons.length],
        status,
        openedAt: new Date(2025, 8, 23, 10, 45).toISOString()
    }
})

export const getDisputeDetailsById = (id: string): DisputeItemDetails | undefined => {
    const item = DISPUTES_ITEMS_MOCK.find(i => i.id === id)
    if (!item) return undefined

    return {
        ...item,
        description: "The buyer reported that the item received does not match the description provided in the listing. The seller has been notified and is required to respond within 48 hours.",
        orderType: 'live-auction',
        heldAmount: 2000,
        slaCounter: {
            days: 2,
            hours: 9,
            minutes: 59
        },
        buyerMessage: 'المنتج لا يطابق الوصف المذكور في الإعلان، وهناك عيوب واضحة لم تُذكر.',
        requestedOutcome: 'Return + Full refund',
        orderSnapshot: {
            itemTotalAmount: 2000,
            shippingFees: 50,
            vat: 50,
            totalAmount: 2100
        },
        orderAmount: 2100,
        buyerDetails: {
            id: 'BY-2231',
            name: item.buyer.name,
            phone: '+966 xxxxxxxxx',
            email: 'buyer@example.com'
        },
        sellerDetails: {
            id: 'SL-2231',
            name: item.seller,
            phone: '+966 xxxxxxxxx',
            status: 'active'
        },
        activityLog: [
            {
                item: 'Dispute opened',
                createdAt: '09/23/2025 10:45 AM',
                reason: ''
            }
        ],
        resolution: item.status.startsWith('resolved-') ? {
            outcome: item.status === 'resolved-buyer' ? 'disputes.details.resolution.outcomes.buyerWins' :
                item.status === 'resolved-seller' ? 'disputes.details.resolution.outcomes.sellerWins' :
                    'disputes.details.resolution.outcomes.compromise',
            reason: 'disputes.details.resolution.mockReason',
            resolvedAt: '22 Jan 2026, 12:40',
            resolvedBy: 'Admin (Ops-Admin-01)'
        } : undefined
    }
}
