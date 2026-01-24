import { BaseEntity, LanguageCode, Status } from './common'

export type { LanguageCode }

export interface BrandTranslation {
    brandId: string
    languageCode: LanguageCode

    value: string
    field: string
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
    itemsCount?: number // Mirroring categories if they have it
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
    categoryId: string | null
}
