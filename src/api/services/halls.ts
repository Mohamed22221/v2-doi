import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import api from '../api'
import { HallItem, HallPayload } from '../types/halls'

const HallsServices = {
    getHalls: (searchParams: string): Promise<TAPIResponseItems<HallItem[]>> =>
        api.get(`/admin/halls?${searchParams}`),

    createHall: (data: HallPayload): Promise<TAPIResponseItem<HallItem>> =>
        api.post('/admin/halls', data),


}

export default HallsServices
