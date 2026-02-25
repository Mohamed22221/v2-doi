import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import HallsServices from '../services/halls'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import { HallItem, HallPayload } from '../types/halls'
import { TAPIResponseItems } from '../types/api'

export const useGetAllHalls = () => {
    const { i18n } = useTranslation()
    const lang = i18n.language
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const query = useQuery<TAPIResponseItems<HallItem[]>>({
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

export const useCreateHall = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: HallPayload) => HallsServices.createHall(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_HALLS],
            })
        },
    })
}

