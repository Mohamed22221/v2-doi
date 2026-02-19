import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AreasServices from '../services/areas'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import { Area } from '../types/areas'

export const useGetAllAreas = () => {
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const query = useQuery({
        queryKey: [ReactQueryKeys.ALL_AREAS, queryString],
        queryFn: () => AreasServices.getAreas(queryString),
    })

    const { data, isError, error } = query

    return {
        ...query,
        areas: data?.data ?? [],
        errorMessage: isError ? getApiErrorMessage(error) : '',
    }
}

export const useCreateArea = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: Partial<Area>) => AreasServices.createArea(data as any),
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
            AreasServices.updateArea(id, data as any),
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
