import { Brand } from './brands'
import { Category } from './categories'
import { BaseEntity } from './common'

export interface Model extends BaseEntity {
    brandId: string
    categoryId: string
    brand: Brand
    category: Category
    name: string
    slug: string
    releaseYear: number
    sortOrder: number
}

export type ModelTableRow = Model

export interface ModelPayload {
    brandId: string
    categoryId: string
    name: string
    releaseYear: number
    sortOrder: number
}
