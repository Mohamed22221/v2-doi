import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import HallsServices from '../services/halls'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import {
    HallItem as HallMainItem,
    HallItemDetails,
    HallTranslationDetail,
    MainHall,
} from '../types/halls'
import { HallAuctionItem } from '../types/hall-auctions'
import { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import { EffectiveStatus } from '../types/products'

const EMPTY_ARRAY: unknown[] = []

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
        items: query.data?.data?.items ?? (EMPTY_ARRAY as HallMainItem[]),
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetHallById = (id: string) => {
    const { i18n } = useTranslation()
    const currentLang = i18n.language
    const query = useQuery<TAPIResponseItem<HallItemDetails>>({
        queryKey: [ReactQueryKeys.HALL_DETAILS, id, currentLang],
        queryFn: () => HallsServices.getHallById(id),
        enabled: !!id,
    })

    return {
        ...query,
        hall: query.data?.data,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetHallTranslations = (id: string) => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const query = useQuery<TAPIResponseItem<HallTranslationDetail[]>>({
        queryKey: [ReactQueryKeys.HALL_TRANSLATIONS, id, lang],
        queryFn: () => HallsServices.getHallTranslations(id),
        enabled: !!id,
    })

    return {
        ...query,
        translations: query.data?.data,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetHallAuctions = (hallId: string) => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [searchParams] = useSearchParams()

    const filteredParams = new URLSearchParams(searchParams.toString())
    filteredParams.delete('page')
    filteredParams.set('limit', '1000') // Fetch all
    const queryString = filteredParams.toString()

    const query = useQuery<TAPIResponseItems<HallAuctionItem[]>>({
        queryKey: [ReactQueryKeys.HALL_AUCTIONS, hallId, lang, queryString],
        queryFn: () => HallsServices.getHallAuctions(hallId, queryString),
        enabled: !!hallId,
    })

    return {
        ...query,
        items: query.data?.data?.items ?? (EMPTY_ARRAY as HallAuctionItem[]),
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 1000,
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
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_HALLS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.HALL_DETAILS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.HALL_AUCTIONS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ASSIGNABLE_AUCTIONS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.HALL_TRANSLATIONS],
            })
        },
    })
}

export const useGetAssignableAuctions = (
    search?: string,
    categoryId?: string,
    effectiveStatus?: EffectiveStatus,
    enabled = true,
) => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    return useInfiniteQuery({
        queryKey: [
            ReactQueryKeys.ASSIGNABLE_AUCTIONS,
            search,
            categoryId,
            effectiveStatus,
            lang,
        ],
        initialPageParam: 1,
        enabled,
        queryFn: ({ pageParam }) =>
            HallsServices.getAssignableAuctions(
                pageParam as number,
                10,
                search,
                categoryId,
                effectiveStatus,
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
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: { productIds: string[] }
        }) => HallsServices.assignItemsToHall(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_HALLS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.HALL_DETAILS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.HALL_AUCTIONS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ASSIGNABLE_AUCTIONS],
            })
        },
    })
}

export const useArchiveHall = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => HallsServices.archiveHall(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.HALL_DETAILS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_HALLS],
            })
        },
    })
}

export const useDeleteHall = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => HallsServices.deleteHall(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_HALLS],
            })
        },
    })
}

export const useDeleteHallItem = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => HallsServices.deleteHallItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.HALL_AUCTIONS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ASSIGNABLE_AUCTIONS],
            })
        },
    })
}
