export type LanguageCode = 'en' | 'ar'

export type Status = 'active' | 'inactive'

export interface BaseEntity {
    id: string
    createdAt: string // ISO Date
    updatedAt: string // ISO Date
    deletedAt: string | null
}

export interface Translation {
    languageCode: LanguageCode
    field: string
    value: string
}
