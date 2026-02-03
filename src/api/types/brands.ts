import { Category } from './categories'
import { BaseEntity, LanguageCode, Status } from './common'

export type { LanguageCode }

export interface BrandTranslation {
    brandId: string
    languageCode: LanguageCode

    name: string
    description?: string
}

export interface Brand extends BaseEntity {
    slug: string
    logoUrl: string | null
    description: string | null
    status: Status
    sortOrder: number
    translations: BrandTranslation[]
    categoryId: string | null
    brandCategories: {
        id: string
        brandId: string
        categoryId: string
        category: Category // Can be typed more specifically if needed
    }[]
    totalItems: number
}

export type BrandTableRow = Brand

export interface BrandTranslationPayload {
    languageCode: string
    name: string
    description?: string
}

export interface BrandPayload {
    translations: BrandTranslationPayload[]
    logoUrl: string | null
    status: Status
    sortOrder: number
    categoryIds: string[] | null
}
