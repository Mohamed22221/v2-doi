import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AreasServices, { TAPIResponseAreas } from '../services/areas'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import { Area } from '../types/areas'



export const useGetAllAreas = () => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()
    const query = useQuery<TAPIResponseAreas<Area[]>>({
        queryKey: [ReactQueryKeys.ALL_AREAS, queryString, lang],
        queryFn: () => AreasServices.getAreas(queryString),
    })


    return {
        ...query,
        areas: query.data?.data?.areas ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}


export const useCreateArea = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: Partial<Area>) => AreasServices.createArea(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_AREAS],
            })
        },
    })
}

export const useUpdateArea = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Area> }) =>
            AreasServices.updateArea(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_AREAS],
            })
        },
    })
}

export const useDeleteArea = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => AreasServices.deleteArea(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_AREAS],
            })
        },
    })
}
