import { LiveAuctionItem, LiveAuctionItemDetails } from '@/api/types/live-auctions'

export const DURATION_AUCTIONS_MOCK: LiveAuctionItem[] = Array.from({ length: 1000 }).map((_, index) => {
    const statuses: LiveAuctionItem['status'][] = ['live', 'scheduled', 'hidden', 'ended', 'rejected']
    const status = statuses[index % statuses.length]
    const id = `DA-${30001 + index}`

    const items = [
        'Rare Stamp Collection',
        'Signed Memorabilia',
        'Classic Car Model',
        'Vintage Vinyl Record',
        'Luxury Timepiece'
    ]
    const sellers = ['StampKing', 'SignaturesInc', 'AutoRetro', 'VinylVibe', 'TimeLux']
    const halls = ['International Hall', 'London Hall', 'New York Hall']
    const categoryParents = ['Collectibles', 'Sports', 'Toys', 'Music', 'Watches']
    const categoryChildren = ['Stamps', 'Autographs', 'Models', 'Vinyl', 'Luxury']

    const itemIndex = index % items.length

    return {
        id,
        name: items[itemIndex],
        seller: sellers[itemIndex],
        hall: halls[index % halls.length],
        categoryParent: categoryParents[itemIndex],
        categoryChild: categoryChildren[itemIndex],
        categoryId: `cat-${itemIndex + 1}`,
        status,
        startDate: new Date(2026, 2, 1, 12, 0).toISOString(),
        endDate: new Date(2026, 2, 10, 12, 0).toISOString(),
        image: `https://picsum.photos/seed/${id}/200`
    }
})

export const getDurationAuctionDetailsById = (id: string): LiveAuctionItemDetails | undefined => {
    const item = DURATION_AUCTIONS_MOCK.find(i => i.id === id)
    if (!item) return undefined

    return {
        ...item,
        description: 'Detailed description for ' + item.name + '. This is a duration auction that allows bidding over several days.',
        startingPrice: 3000,
        availableQuantity: 5,
        finalPrice: (item.status === 'hidden' || item.status === 'ended') ? 7500 : undefined,
        winner: (item.status === 'hidden' || item.status === 'ended') ? { id: 'USR-777', name: 'Omar F.' } : undefined,
        currentHighestBid: item.status === 'live' ? 5000 : undefined,
        mediaAssets: [
            `https://picsum.photos/seed/${id}-1/400`,
            `https://picsum.photos/seed/${id}-2/400`,
            `https://picsum.photos/seed/${id}-3/400`,
        ],
        sellerDetails: {
            id: 'SL-9988',
            name: item.seller,
            phone: '+971 xxxxxxxxx',
            status: 'active'
        },
        activityLog: [
            {
                item: 'Auction announced',
                createdAt: new Date(2026, 1, 25, 9, 30).toISOString(),
            },
            {
                item: 'Catalog uploaded',
                createdAt: new Date(2026, 1, 26, 14, 0).toISOString(),
            }
        ]
    }
}
