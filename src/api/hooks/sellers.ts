import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import ReactQueryKeys from '../constants/apikeys.constant'
import SellersServices from '../services/sellers'
import { getApiErrorMessage } from '../error'
import type { TAPIResponseItem, TAPIResponseItems } from '../types/api'
import {
    SellerItem,
    SellerDocument,
    TSellerActionPayload,
} from '../types/sellers'
import { useAppSelector } from '@/store'

export const useGetSellers = () => {
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const lang = useAppSelector((state) => state.locale.currentLang)

    const query = useQuery<TAPIResponseItems<SellerItem[]>>({
        queryKey: [ReactQueryKeys.ALL_SELLERS, queryString, lang],
        queryFn: () => SellersServices.getSellers(queryString),
    })

    return {
        ...query,
        sellers: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetSellerDetails = (
    id: string,
    options?: Omit<
        UseQueryOptions<TAPIResponseItem<SellerItem>>,
        'queryKey' | 'queryFn'
    >,
) => {
    const lang = useAppSelector((state) => state.locale.currentLang)
    return useQuery<TAPIResponseItem<SellerItem>>({
        queryKey: [ReactQueryKeys.GET_SELLER_DETAILS, id, lang],
        queryFn: () => SellersServices.getSellerDetails(id),
        ...options,
    })
}

export const useGetSellerDocuments = (
    userId: string,
    options?: Omit<
        UseQueryOptions<TAPIResponseItem<SellerDocument[]>>,
        'queryKey' | 'queryFn'
    >,
) => {
    const lang = useAppSelector((state) => state.locale.currentLang)
    return useQuery<TAPIResponseItem<SellerDocument[]>>({
        queryKey: [ReactQueryKeys.SELLER_DOCUMENTS, userId, lang],
        queryFn: () => SellersServices.getSellerDocuments(userId),
        ...options,
    })
}

export const useApproveSeller = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => SellersServices.approveSeller(userId),
        onSuccess: (_data, userId) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_SELLER_DETAILS, userId],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_SELLERS],
            })
        },
    })
}

export const useRejectSeller = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: string
            data: TSellerActionPayload
        }) => SellersServices.rejectSeller(userId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_SELLER_DETAILS, variables.userId],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_SELLERS],
            })
        },
    })
}

export const useSuspendSeller = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: string
            data: TSellerActionPayload
        }) => SellersServices.suspendSeller(userId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_SELLER_DETAILS, variables.userId],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_SELLERS],
            })
        },
    })
}

export const useDeleteSeller = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            userId,
            data,
        }: {
            userId: string
            data: TSellerActionPayload
        }) => SellersServices.deleteSeller(userId, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_SELLER_DETAILS, variables.userId],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_SELLERS],
            })
        },
    })
}

export const useActivateSeller = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => SellersServices.activateSeller(userId),
        onSuccess: (_data, userId) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_SELLER_DETAILS, userId],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_SELLERS],
            })
        },
    })
}
export const useRestoreSeller = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => SellersServices.restoreSeller(userId),
        onSuccess: (_data, userId) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_SELLER_DETAILS, userId],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_SELLERS],
            })
        },
    })
}
