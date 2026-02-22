import { City } from './cities'
import { BaseEntity } from './common'

export interface Area extends BaseEntity {
    name: string
    nameAr: string
    city?: City
    cityId: string
}
