import { FixedPriceItem, FixedPriceItemDetails } from '@/api/types/fixed-price'

export const FIXED_PRICE_ITEMS_MOCK: FixedPriceItem[] = Array.from({ length: 1250 }).map((_, index) => {
    const statuses: FixedPriceItem['status'][] = ['active', 'rejected', 'hidden', 'out_of_stock', 'pending_review']
    const status = statuses[index % statuses.length]
    const id = `IT-${99000 + index}`

    return {
        id,
        name: index === 0 ? 'Electric Kettle 1.7L' : `Product ${index + 1}`,
        seller: index % 3 === 0 ? 'HomePlus' : index % 3 === 1 ? 'Jane Smith' : 'Tech Store',
        categoryParent: 'Home Appliances',
        categoryChild: 'Kitchen',
        status,
        createdAt: new Date(2024, 8, 23, 10, 45).toISOString(),
        image: `https://picsum.photos/seed/${id}/200`,
        slug: `product-${index + 1}`,
        translations: [
            { languageCode: 'en', name: index === 0 ? 'Electric Kettle 1.7L' : `Product ${index + 1}` },
            { languageCode: 'ar', name: index === 0 ? 'غلاية كهربائية سعة 1.7 لتر' : `منتج ${index + 1}` }
        ]
    }
})

export const getFixedPriceDetailsById = (id: string): FixedPriceItemDetails | undefined => {
    const item = FIXED_PRICE_ITEMS_MOCK.find(i => i.id === id)
    if (!item) return undefined

    return {
        ...item,
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        price: 2000,
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
                item: 'Item created by seller',
                createdAt: item.createdAt,
                reason: ''
            }
        ]
    }
}
