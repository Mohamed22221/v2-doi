import { TAPIResponse, TAPIResponseItem } from '../types/api'
import api from '../api'
import { Region } from '../types/regions'

const RegionsServices = {
    getRegions: (searchParams: string): Promise<TAPIResponse<Region[]>> =>
        api.get(`/admin/regions?${searchParams}`),
    createRegion: (data: Partial<Region>): Promise<TAPIResponseItem<Region>> =>
        api.post('/admin/regions', data),
    updateRegion: (
        id: string,
        data: Partial<Region>
    ): Promise<TAPIResponseItem<Region>> => api.put(`/admin/regions/${id}`, data),
    deleteRegion: (id: string): Promise<TAPIResponseItem<null>> =>
        api.delete(`/admin/regions/${id}`),
}

export default RegionsServices
