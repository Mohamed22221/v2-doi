import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import api from '../api'
import { HallItem, HallItemDetails, HallPayload } from '../types/halls'
import { HallAuctionItem } from '../types/hall-auctions'

const HallsServices = {
    getHalls: (searchParams: string): Promise<TAPIResponseItems<HallItem[]>> =>
        api.get(`/admin/halls?${searchParams}`),

    createHall: (data: HallPayload): Promise<TAPIResponseItem<HallItem>> =>
        api.post('/admin/halls', data),

    getHallById: (id: string): Promise<TAPIResponseItem<HallItemDetails>> =>
        api.get(`/admin/halls/${id}`),

    getHallAuctions: (hallId: string, searchParams: string): Promise<TAPIResponseItems<HallAuctionItem[]>> =>
        api.get(`/admin/hall-items/auctions/${hallId}?${searchParams}`),
}

export default HallsServices
