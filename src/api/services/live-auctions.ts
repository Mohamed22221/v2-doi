import api from '../api'
import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import {
    HallItem,
    HallItemDetails,
    HideHallItemPayload,
    RejectHallItemPayload,
} from '../types/hall-auctions'

const LiveAuctionsServices = {
    // GET /api/v1/admin/hall-items
    getHallItems: (searchParams: string): Promise<TAPIResponseItems<HallItem[]>> =>
        api.get(`/admin/hall-items?${searchParams}`),

    // GET /api/v1/admin/hall-items/item/{id}
    getHallItemById: (id: string): Promise<TAPIResponseItem<HallItemDetails>> =>
        api.get(`/admin/hall-items/item/${id}`),

    // DELETE /api/v1/admin/hall-items/item/{id}
    deleteHallItem: (id: string): Promise<TAPIResponseItem<null>> =>
        api.delete(`/admin/hall-items/item/${id}`),

    // PATCH /api/v1/admin/hall-items/item/reject/{id}
    rejectHallItem: (id: string, data: RejectHallItemPayload): Promise<TAPIResponseItem<HallItemDetails>> =>
        api.patch(`/admin/hall-items/item/reject/${id}`, data),

    // PATCH /api/v1/admin/hall-items/item/hide/{id}
    hideHallItem: (id: string, data: HideHallItemPayload): Promise<TAPIResponseItem<HallItemDetails>> =>
        api.patch(`/admin/hall-items/item/hide/${id}`, data),

    // PATCH /api/v1/admin/hall-items/item/unhide/{id}
    unhideHallItem: (id: string): Promise<TAPIResponseItem<HallItemDetails>> =>
        api.patch(`/admin/hall-items/item/unhide/${id}`),

    // PATCH /api/v1/admin/hall-items/item/{id}/reorder
    reorderHallItem: (id: string): Promise<TAPIResponseItem<HallItemDetails>> =>
        api.patch(`/admin/hall-items/item/${id}/reorder`),

    // POST /api/v1/admin/hall-items/item/{id}/end
    forceEndHallItem: (id: string): Promise<TAPIResponseItem<HallItemDetails>> =>
        api.post(`/admin/hall-items/item/${id}/end`),
}

export default LiveAuctionsServices
