import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import api from '../api'
import { HallItem, HallItemDetails, MainHall } from '../types/halls'
import { AssignableAuctionItem, AssignItemsToHallPayload, HallAuctionItem } from '../types/hall-auctions'

const HallsServices = {
    getHalls: (searchParams: string): Promise<TAPIResponseItems<HallItem[]>> =>
        api.get(`/admin/halls?${searchParams}`),

    createHall: (data: MainHall): Promise<TAPIResponseItem<MainHall>> =>
        api.post('/admin/halls', data),

    updateHall: (id: string, data: MainHall): Promise<TAPIResponseItem<HallItem>> =>
        api.put(`/admin/halls/${id}`, data),

    getHallById: (id: string): Promise<TAPIResponseItem<HallItem>> =>
        api.get(`/admin/halls/${id}`),

    getHallAuctions: (hallId: string, searchParams: string): Promise<TAPIResponseItems<HallAuctionItem[]>> =>
        api.get(`/admin/hall-items/auctions/${hallId}?${searchParams}`),

    getAssignableAuctions: (page: number, limit: number, search?: string, categoryId?: string): Promise<TAPIResponseItems<AssignableAuctionItem[]>> =>
        api.get(`/admin/hall-items/auctions`, { params: { page, limit, ...(search ? { search } : {}), ...(categoryId ? { categoryId } : {}) } }),

    assignItemsToHall: (id: string, data: { productIds: string[] }): Promise<TAPIResponseItem<AssignItemsToHallPayload>> =>
        api.post(`/admin/hall-items/${id}/items`, data),

    archiveHall: (id: string): Promise<TAPIResponseItem<HallItemDetails>> =>
        api.patch(`/admin/halls/archive/${id}`),

    deleteHall: (id: string): Promise<TAPIResponseItem<null>> =>
        api.delete(`/admin/halls/${id}`),
}

export default HallsServices
