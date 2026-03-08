import { TAPIResponseItem, TAPIResponseItems, TPaginationSimple } from '../types/api'
import api from '../api'
import { Region } from '../types/regions'

export type TAPIResponseRegions<T> = {
    status: true
    message: string
    data: {
        regions: T
    } & TPaginationSimple
}
const RegionsServices = {
    getRegions: (searchParams: string): Promise<TAPIResponseRegions<Region[]>> =>
        api.get(`/admin/regions?${searchParams}`),
    createRegion: (data: Partial<Region>): Promise<TAPIResponseItem<Region>> =>
        api.post('/admin/regions', data),
    updateRegion: (
        id: string,
        data: Partial<Region>
    ): Promise<TAPIResponseItem<Region>> => api.put(`/admin/regions/${id}`, data),
    deleteRegion: (id: string): Promise<TAPIResponseItem<null>> =>
        api.delete(`/admin/regions/${id}`),

    getInfinityRegions: (
        page: number,
        limit: number = 10,
        search?: string,
    ): Promise<TAPIResponseRegions<Region[]>> =>
        api.get('/admin/regions', {
            params: {
                page,
                limit,
                ...(search && { search }),
            },
        }),
}

export default RegionsServices
