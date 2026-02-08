import api from '../api'
import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import {
    SellerItem,
    SellerDocument,
    TSellersParams,
    TSellerActionPayload,
} from '../types/sellers'

const SellersServices = {
    getSellers: (
        searchParams: string,
    ): Promise<TAPIResponseItems<SellerItem[]>> =>
        api.get(`/admin/sellers?${searchParams}`),

    getSellerDetails: (id: string): Promise<TAPIResponseItem<SellerItem>> =>
        api.get(`/admin/sellers/${id}`),

    getSellerDocuments: (
        userId: string,
    ): Promise<TAPIResponseItem<SellerDocument[]>> =>
        api.get(`/admin/sellers/${userId}/documents`),

    approveSeller: (userId: string): Promise<TAPIResponseItem<SellerItem>> =>
        api.patch(`/admin/sellers/${userId}/approve`),

    rejectSeller: (
        userId: string,
        data: TSellerActionPayload,
    ): Promise<TAPIResponseItem<SellerItem>> =>
        api.patch(`/admin/sellers/${userId}/reject`, data),

    suspendSeller: (
        userId: string,
        data: TSellerActionPayload,
    ): Promise<TAPIResponseItem<SellerItem>> =>
        api.patch(`/admin/sellers/${userId}/suspend`, data),

    deleteSeller: (
        userId: string,
        data: TSellerActionPayload,
    ): Promise<TAPIResponseItem<SellerItem>> =>
        api.patch(`/admin/sellers/${userId}/delete`, data),

    activateSeller: (userId: string): Promise<TAPIResponseItem<SellerItem>> =>
        api.patch(`/admin/sellers/${userId}/activate`),

    restoreSeller: (userId: string): Promise<TAPIResponseItem<SellerItem>> =>
        api.patch(`/admin/sellers/${userId}/restore`),
}

export default SellersServices
