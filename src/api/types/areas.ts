import { BaseEntity } from './common'

export interface Area extends BaseEntity {
    name: string
    nameAr: string
    cityId: string
    cityName?: string // Optional for mapping in table
    cityNameAr?: string
    regionName?: string // Optional for mapping in table
    regionNameAr?: string
}
