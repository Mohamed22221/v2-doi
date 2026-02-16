import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import api from '../api'
import {
    Product,
    THideProductPayload,
    TRejectProductPayload,
} from '../types/products'

const ProductsServices = {
    getProducts: (
        searchParams: string,
    ): Promise<TAPIResponseItems<Product[]>> =>
        api.get(`/admin/products?${searchParams}&productSellType=fixed_price`),

    getProductById: (id: string): Promise<TAPIResponseItem<Product>> =>
        api.get(`/admin/products/${id}`),

    approveProduct: (id: string): Promise<TAPIResponseItem<Product>> =>
        api.patch(`/admin/products/${id}/approve`),

    rejectProduct: (
        id: string,
        data: TRejectProductPayload,
    ): Promise<TAPIResponseItem<Product>> =>
        api.patch(`/admin/products/${id}/reject`, data),

    hideProduct: (
        id: string,
        data: THideProductPayload,
    ): Promise<TAPIResponseItem<Product>> =>
        api.patch(`/admin/products/${id}/hide`, data),

    unHideProduct: (id: string): Promise<TAPIResponseItem<Product>> =>
        api.patch(`/admin/products/${id}/unhide`),
}

export default ProductsServices
