import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import LiveAuctionsServices from '../services/live-auctions'
import ReactQueryKeys from '../constants/apikeys.constant'
import { getApiErrorMessage } from '../error'
import {
    HallItem,
    HallItemDetails,
    HideHallItemPayload,
    RejectHallItemPayload,
    ReorderHallItemPayload,
} from '../types/hall-auctions'
import { TAPIResponseItems, TAPIResponseItem } from '../types/api'

export const useGetHallItems = () => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const query = useQuery<TAPIResponseItems<HallItem[]>>({
        queryKey: [ReactQueryKeys.HALL_ITEMS, queryString, lang],
        queryFn: () => LiveAuctionsServices.getHallItems(queryString),
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

export const useGetHallItemById = (id: string) => {
    const { i18n } = useTranslation()
    const lang = i18n.language

    const query = useQuery<TAPIResponseItem<HallItemDetails>>({
        queryKey: [ReactQueryKeys.HALL_ITEM_DETAILS, id, lang],
        queryFn: () => LiveAuctionsServices.getHallItemById(id),
        enabled: !!id,
    })

    return {
        ...query,
        hallItem: query.data?.data,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useDeleteHallItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => LiveAuctionsServices.deleteHallItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEMS] })
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_AUCTIONS] })
        },
    })
}

export const useRejectHallItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: RejectHallItemPayload }) =>
            LiveAuctionsServices.rejectHallItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEMS] })
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEM_DETAILS] })
        },
    })
}

export const useHideHallItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: HideHallItemPayload }) =>
            LiveAuctionsServices.hideHallItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEMS] })
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEM_DETAILS] })
        },
    })
}

export const useUnhideHallItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => LiveAuctionsServices.unhideHallItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEMS] })
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEM_DETAILS] })
        },
    })
}

export const useReorderHallItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: ReorderHallItemPayload }) =>
            LiveAuctionsServices.reorderHallItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEMS] })
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_AUCTIONS] })
        },
    })
}

export const useForceEndHallItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => LiveAuctionsServices.forceEndHallItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEMS] })
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_ITEM_DETAILS] })
            queryClient.invalidateQueries({ queryKey: [ReactQueryKeys.HALL_AUCTIONS] })
        },
    })
}
