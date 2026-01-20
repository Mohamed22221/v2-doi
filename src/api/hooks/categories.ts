import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import type { TAPIResponseItems } from '../types/api'
import { Category } from '../types/categories'
import CategoriesServices from '../services/categories'
import ReactQueryKeys from '../constants/apikeys.constant'

export const useGetAllCategories= () => {
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const query = useQuery<TAPIResponseItems<Category[]>>({
        queryKey: [ReactQueryKeys.ALL_CATEGORIES, queryString],
        queryFn: () => CategoriesServices.getAllCategories(queryString),
    })

    return {
        ...query,
        categories: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}
