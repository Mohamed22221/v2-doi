import { TAPIResponseItem, TPaginationSimple } from '../types/api'
import api from '../api'
import { Area } from '../types/areas'

export type TAPIResponseAreas<T> = {
    status: true
    message: string
    data: {
        areas: T
    } & TPaginationSimple
}
const AreasServices = {
    getAreas: (searchParams: string): Promise<TAPIResponseAreas<Area[]>> =>
        api.get(`/admin/areas?${searchParams}`),
    createArea: (data: Partial<Area>): Promise<TAPIResponseItem<Area>> =>
        api.post('/admin/areas', data),
    updateArea: (
        id: string,
        data: Partial<Area>,
    ): Promise<TAPIResponseItem<Area>> => api.put(`/admin/areas/${id}`, data),
    deleteArea: (id: string): Promise<TAPIResponseItem<null>> =>
        api.delete(`/admin/areas/${id}`),
}

export default AreasServices
