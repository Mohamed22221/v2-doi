
export type FixedPriceStatus = 'active' | 'rejected' | 'hidden' | 'out_of_stock' | 'pending_review'

export interface FixedPriceTranslation {
    languageCode: string
    name: string
}

export interface FixedPriceItem {
    id: string
    name: string
    seller: string
    categoryParent: string
    categoryChild: string
    status: FixedPriceStatus
    createdAt: string
    image?: string
    slug: string
    translations: FixedPriceTranslation[]
}

export interface FixedPriceResponse {
    items: FixedPriceItem[]
    total: number
}
