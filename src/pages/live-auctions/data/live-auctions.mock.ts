import { LiveAuctionItem, LiveAuctionItemDetails } from '@/api/types/live-auctions'

export const LIVE_AUCTIONS_MOCK: LiveAuctionItem[] = Array.from({ length: 1250 }).map((_, index) => {
    const statuses: LiveAuctionItem['status'][] = ['live', 'scheduled', 'hidden', 'ended', 'rejected']
    const status = statuses[index % statuses.length]
    const id = `LA-${20031 + index}`

    const items = [
        'Vintage Watch Collection',
        'Luxury Perfume Set',
        'Antique Wooden Chair',
        'Gaming Headset RGB',
        'iPhone 14 Pro Live Auction'
    ]
    const sellers = ['TimeHouse', 'Elite Scents', 'Heritage Market', 'ProGamers', 'SmartTech Store', 'HomePlus']
    const halls = ['Riyadh Hall', 'Jeddah Hall', 'Dubai Hall']
    const categoryParents = ['Collectibles', 'Fashion', 'Antiques', 'Electronics', 'Electronics']
    const categoryChildren = ['Watches', 'Shoes', 'Furniture', 'Accessories', 'Mobile Phones']

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
        startDate: new Date(2026, 1, 5, 18, 0).toISOString(),
        endDate: new Date(2026, 1, 5, 19, 30).toISOString(),
        image: `https://picsum.photos/seed/${id}/200`
    }
})

export const getLiveAuctionDetailsById = (id: string): LiveAuctionItemDetails | undefined => {
    const item = LIVE_AUCTIONS_MOCK.find(i => i.id === id)
    if (!item) return undefined

    return {
        ...item,
        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
        startingPrice: 2000,
        availableQuantity: 30,
        mediaAssets: [
            `https://picsum.photos/seed/${id}-1/400`,
            `https://picsum.photos/seed/${id}-2/400`,
            `https://picsum.photos/seed/${id}-3/400`,
            `https://picsum.photos/seed/${id}-4/400`,
        ],
        sellerDetails: {
            id: 'SL-2231',
            name: item.seller,
            phone: '+966 xxxxxxxxx',
            status: 'active'
        },
        activityLog: [
            {
                item: 'Auction created by seller',
                createdAt: new Date(2025, 8, 23, 10, 45).toISOString(),
            },
            {
                item: 'Auction scheduled',
                createdAt: new Date(2025, 8, 23, 10, 45).toISOString(),
            }
        ]
    }
}
