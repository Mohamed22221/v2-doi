import { BaseEntity } from './common'

export interface Region extends BaseEntity {
    name: string
    nameAr: string
    cities: string[]
}
