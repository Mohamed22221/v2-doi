import { Category } from './categories'
import { BaseEntity } from './common'

export interface ProductImage {
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    id: string
    productId: string
    url: string
    key: string
}

export interface ProductCategoryTranslation {
    languageCode: string
    name: string
}

export interface ProductCategory {
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    id: string
    parentId: string | null
    level: number
    slug: string
    status: string
    sortOrder: number
    image: string | null
    translations?: ProductCategoryTranslation[]
}

export interface ProductBrand {
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    id: string
    slug: string
    status: string
    image: string | null
}

export interface ProductModel {
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    id: string
    slug: string
    status: string
}

export type ProductStatus = 'new' | 'used'
export type ProductModerationStatus = 'pending' | 'approved' | 'rejected' | 'hidden'
export type ProductBusinessStatus = 'available' | 'sold' | 'reserved'
export type PublishStatus = 'published' | 'draft' | 'archived'
export type SellType = 'fixed_price' | 'live_auction' | 'period_auction'
export type EffectiveStatus = 'active' | 'pending_approval' | 'auction_scheduled' | 'rejected' | 'hidden' | 'sold' | 'draft'

export interface Product extends BaseEntity {
    title: string
    slug: string
    description: string
    price: number | null
    userId: string
    categoryId: string
    category: Category
    brandId: string | null
    brand: ProductBrand | null
    modelId: string | null
    model: ProductModel | null
    images: ProductImage[]
    parentId: string | null
    bundleItems?: Product[]
    isBundle: boolean
    regionId: string | null
    cityId: string | null
    areaId: string | null
    pickupLocation: string | null
    size: string
    dimensions: string | null
    quantity: number
    quantityUnit: string | null
    status: ProductStatus
    moderationStatus: EffectiveStatus
    rejectionReason: string | null
    businessStatus: ProductBusinessStatus
    publishStatus: PublishStatus
    sellType: SellType
    conditionPercentage: number
    defects: string | null
    isNegotiable: boolean
    needsRepair: boolean
    pickupAddress: string
    manufacturingDate: string
    auctionStartingPriceIncVat: number | null
    auctionMinBidIncrement: number | null
    auctionInstantBuyPriceIncVat: number | null
    auctionStartAt: string | null
    auctionDurationDays: number | null
    isInActiveAuction: boolean
    effectiveStatus: EffectiveStatus
    user?: {
        id: string
        firstName: string
        lastName: string
    }
}

export interface TRejectProductPayload {
    rejectionReason: string
}

export interface THideProductPayload {
    hiddenReason: string
}