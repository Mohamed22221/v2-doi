import { BaseEntity } from './common'

export interface City extends BaseEntity {
    name: string
    nameAr: string
    regionId: string
    areasCount: number
    region?: {
        id: string
        name: string
        nameAr: string
    }
}
