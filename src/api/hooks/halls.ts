import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import HallsServices from '../services/halls'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
// Alias to avoid name clash with HallItem from hall-auctions
import {
    HallItem as HallMainItem,
    HallItemDetails,
    MainHall,
} from '../types/halls'
import { HallAuctionItem, HallItem } from '../types/hall-auctions'
import { TAPIResponseItems, TAPIResponseItem } from '../types/api'

export const useGetAllHalls = () => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const query = useQuery<TAPIResponseItems<HallMainItem[]>>({
        queryKey: [ReactQueryKeys.ALL_HALLS, queryString, lang],
        queryFn: () => HallsServices.getHalls(queryString),
    })

    return {
        ...query,
        items: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetHallItems = () => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const query = useQuery<TAPIResponseItems<HallItem[]>>({
        queryKey: [ReactQueryKeys.HALL_ITEMS, queryString, lang],
        queryFn: () => HallsServices.getHallItems(queryString),
    })

    return {
        ...query,
        items: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetHallById = (id: string) => {
    const { i18n } = useTranslation()
    const lang = i18n.language

    const query = useQuery<TAPIResponseItem<HallItemDetails>>({
        queryKey: [ReactQueryKeys.HALL_DETAILS, id, lang],
        queryFn: () => HallsServices.getHallById(id),
        enabled: !!id,
    })

    return {
        ...query,
        hall: query.data?.data,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetHallAuctions = (hallId: string) => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()
    const query = useQuery<TAPIResponseItems<HallAuctionItem[]>>({
        queryKey: [ReactQueryKeys.HALL_AUCTIONS, hallId, lang, queryString],
        queryFn: () => HallsServices.getHallAuctions(hallId, queryString),
        enabled: !!hallId,
    })

    return {
        ...query,
        items: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useCreateHall = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: MainHall) => HallsServices.createHall(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_HALLS],
            })
        },
    })
}

export const useUpdateHall = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: MainHall }) =>
            HallsServices.updateHall(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.ALL_HALLS] })
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_DETAILS] })
        },
    })
}

export const useGetAssignableAuctions = (search?: string, categoryId?: string, enabled = true) => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    return useInfiniteQuery({
        queryKey: ['ASSIGNABLE_AUCTIONS', search, categoryId, lang],
        initialPageParam: 1,
        enabled,
        queryFn: ({ pageParam }) =>
            HallsServices.getAssignableAuctions(
                pageParam as number,
                10,
                search,
                categoryId,
            ),
        getNextPageParam: (lastPage) =>
            lastPage.data.page < lastPage.data.totalPages
                ? lastPage.data.page + 1
                : undefined,
        select: (data) => ({
            ...data,
            items: data.pages.flatMap((p) => p.data.items),
        }),
    })
}

export const useAssignItemsToHall = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: { productIds: string[] } }) => HallsServices.assignItemsToHall(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.HALL_AUCTIONS],
            })
            queryClient.invalidateQueries({
                queryKey: ["ASSIGNABLE_AUCTIONS"],
            })
        },
    })
}

export const useArchiveHall = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => HallsServices.archiveHall(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_DETAILS] })
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.ALL_HALLS] })
        },
    })
}

export const useDeleteHall = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => HallsServices.deleteHall(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.ALL_HALLS] })
        },
    })
}
