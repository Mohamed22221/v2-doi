import { TAPIResponseItem, TPaginationSimple } from '../types/api'
import api from '../api'
import { City } from '../types/cities'

export type TAPIResponseCities<T> = {
    status: true
    message: string
    data: {
        cities: T
    } & TPaginationSimple
}

const CitiesServices = {
    getCities: (searchParams: string): Promise<TAPIResponseCities<City[]>> =>
        api.get(`/admin/cities?${searchParams}`),
    createCity: (data: Partial<City>): Promise<TAPIResponseItem<City>> =>
        api.post('/admin/cities', data),
    updateCity: (
        id: string,
        data: Partial<City>
    ): Promise<TAPIResponseItem<City>> => api.put(`/admin/cities/${id}`, data),
    deleteCity: (id: string): Promise<TAPIResponseItem<null>> =>
        api.delete(`/admin/cities/${id}`),
}

export default CitiesServices
