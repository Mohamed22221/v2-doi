import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import RegionsServices, { TAPIResponseRegions } from '../services/regions'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import { Region } from '../types/regions'
import { useAppSelector } from '@/store'

export const useGetAllRegions = () => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()
    const query = useQuery<TAPIResponseRegions<Region[]>>({
        queryKey: [ReactQueryKeys.ALL_REGIONS, queryString, lang],
        queryFn: () => RegionsServices.getRegions(queryString),
    })

    return {
        ...query,
        regions: query.data?.data?.regions ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useCreateRegion = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: Partial<Region>) =>
            RegionsServices.createRegion(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_REGIONS],
            })
        },
    })
}

export const useUpdateRegion = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Region> }) =>
            RegionsServices.updateRegion(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_REGIONS],
            })
        },
    })
}

export const useDeleteRegion = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => RegionsServices.deleteRegion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_REGIONS],
            })
        },
    })
}

export function useGetAllRegionsSelect(search?: string) {
    const lang = useAppSelector((state) => state.locale.currentLang)
    return useInfiniteQuery({
        queryKey: ['ALL_REGIONS_SELECT', search, lang],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            RegionsServices.getInfinityRegions(pageParam as number, 10, search),
        getNextPageParam: (lastPage) =>
            lastPage.data.page < lastPage.data.totalPages
                ? lastPage.data.page + 1
                : undefined,
        select: (data) => ({
            ...data,
            items: data.pages.flatMap((p) => p.data.regions),
        }),
    })
}
