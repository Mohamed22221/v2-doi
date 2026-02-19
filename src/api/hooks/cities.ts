import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import CitiesServices from '../services/cities'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import { City } from '../types/cities'

export const useGetAllCities = () => {
    const [searchParams] = useSearchParams()
    // Ensure we don't send pagination/search if not needed, 
    // but following Regions pattern which currently sends whatever is in query string
    const queryString = searchParams.toString()

    const query = useQuery({
        queryKey: [ReactQueryKeys.ALL_CITIES, queryString],
        queryFn: () => CitiesServices.getCities(queryString),
    })

    const { data, isError, error } = query

    return {
        ...query,
        cities: data?.data ?? [],
        // total: data?.data?.total ?? 0,
        // limit: data?.data?.limit ?? 10,
        errorMessage: isError ? getApiErrorMessage(error) : '',
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
