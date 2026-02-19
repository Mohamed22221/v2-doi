import { BaseEntity } from './common'

export interface City extends BaseEntity {
    name: string
    nameAr: string
    regionId: string
    regionName?: string // Optional for mapping in table
    regionNameAr?: string
    areas?: string
}
