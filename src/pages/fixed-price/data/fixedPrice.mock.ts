import { FixedPriceItem } from '@/api/types/fixed-price'

export const FIXED_PRICE_ITEMS_MOCK: FixedPriceItem[] = Array.from({ length: 1250 }).map((_, index) => {
    const statuses: FixedPriceItem['status'][] = ['active', 'rejected', 'hidden', 'out_of_stock', 'pending_review']
    const status = statuses[index % statuses.length]
    const id = `IT-${99000 + index}`

    return {
        id,
        name: `Product ${index + 1}`,
        seller: index % 3 === 0 ? 'John Doe' : index % 3 === 1 ? 'Jane Smith' : 'Tech Store',
        categoryParent: 'Electronics',
        categoryChild: 'Smartphones',
        status,
        createdAt: new Date(2024, 0, 1 + (index % 30), 10, 30).toISOString(),
        image: `https://picsum.photos/seed/${id}/200`,
        slug: `product-${index + 1}`,
        translations: [
            { languageCode: 'en', name: `Product ${index + 1}` },
            { languageCode: 'ar', name: `منتج ${index + 1}` }
        ]
    }
})
