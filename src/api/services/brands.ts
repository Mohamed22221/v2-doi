import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import api from '../api'
import { Brand, BrandPayload } from '../types/brands'

const BrandsServices = {
    getBrands: (searchParams: string): Promise<TAPIResponseItems<Brand[]>> =>
        api.get(`/admin/brands?${searchParams}`),

    createBrand: (payload: BrandPayload): Promise<TAPIResponseItem<Brand>> =>
        api.post('/admin/brands', payload),

    getBrandById: (id: string): Promise<TAPIResponseItem<Brand>> =>
        api.get(`/admin/brands/${id}`),

    updateBrand: (
        id: string,
        payload: BrandPayload,
    ): Promise<TAPIResponseItem<Brand>> =>
        api.patch(`/admin/brands/${id}`, payload),

    deleteBrand: (id: string): Promise<TAPIResponseItem<Brand>> =>
        api.delete(`/admin/brands/${id}`),

    hardDeleteBrand: (id: string): Promise<TAPIResponseItem<Brand>> =>
        api.delete(`/admin/brands/${id}/hard`),

    restoreBrand: (id: string): Promise<TAPIResponseItem<Brand>> =>
        api.patch(`/admin/brands/${id}/restore`),

    activateBrand: (id: string): Promise<TAPIResponseItem<Brand>> =>
        api.patch(`/admin/brands/${id}/activate`),

    deactivateBrand: (id: string): Promise<TAPIResponseItem<Brand>> =>
        api.patch(`/admin/brands/${id}/deactivate`),
    getInfinityBrands: (
        page: number,
        limit: number = 10,
    ): Promise<TAPIResponseItems<Brand[]>> =>
        api.get('/admin/brands', {
            params: {
                page,
                limit,
                status: 'active',
                isDeleted: false,
            },
        }),
}

export default BrandsServices
