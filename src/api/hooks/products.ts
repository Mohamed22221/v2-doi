import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import type { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import { Product, THideProductPayload, TRejectProductPayload } from '../types/products'
import ProductsServices from '../services/products'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useAppSelector } from '@/store'

export const useGetAllProducts = () => {
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const lang = useAppSelector((state) => state.locale.currentLang)
    const query = useQuery<TAPIResponseItems<Product[]>>({
        queryKey: [ReactQueryKeys.ALL_PRODUCTS, queryString, lang],
        queryFn: () => ProductsServices.getProducts(queryString),
    })

    return {
        ...query,
        products: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetProductById = (
    id: string,
    options?: Omit<
        UseQueryOptions<TAPIResponseItem<Product>>,
        'queryKey' | 'queryFn'
    >,
) => {
    const lang = useAppSelector((state) => state.locale.currentLang)
    const query = useQuery<TAPIResponseItem<Product>>({
        queryKey: [ReactQueryKeys.PRODUCT_BY_ID, id, lang],
        queryFn: () => ProductsServices.getProductById(id),
        ...options,
    })

    return {
        ...query,
        product: query.data?.data ?? null,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useApproveProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => ProductsServices.approveProduct(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.PRODUCT_BY_ID, id],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_PRODUCTS],
            })
        },
    })
}

export const useRejectProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: TRejectProductPayload
        }) => ProductsServices.rejectProduct(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.PRODUCT_BY_ID, variables.id],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_PRODUCTS],
            })
        },
    })
}


export const useHideProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: THideProductPayload
        }) => ProductsServices.hideProduct(id, data),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.PRODUCT_BY_ID, variables.id],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_PRODUCTS],
            })
        },
    })
}

export const useUnHideProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => ProductsServices.unHideProduct(id),
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.PRODUCT_BY_ID, id],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_PRODUCTS],
            })
        },
    })
}   
