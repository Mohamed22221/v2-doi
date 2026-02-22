import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CitiesServices, { TAPIResponseCities } from '../services/cities'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import { City } from '../types/cities'

export const useGetAllCities = () => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const query = useQuery<TAPIResponseCities<City[]>>({
        queryKey: [ReactQueryKeys.ALL_CITIES, queryString, lang],
        queryFn: () => CitiesServices.getCities(queryString),
    })

    return {
        ...query,
        cities: query.data?.data?.cities ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useCreateCity = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: Partial<City>) => CitiesServices.createCity(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CITIES],
            })
        },
    })
}

export const useUpdateCity = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<City> }) =>
            CitiesServices.updateCity(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CITIES],
            })
        },
    })
}

export const useDeleteCity = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => CitiesServices.deleteCity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CITIES],
            })
        },
    })
}
