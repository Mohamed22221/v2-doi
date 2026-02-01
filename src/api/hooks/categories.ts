import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    useInfiniteQuery,
} from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../error'
import type { TAPIResponseItems, TAPIResponseItem } from '../types/api'
import { Category, CategoryPayload, CategoryTreeNode } from '../types/categories'
import CategoriesServices from '../services/categories'
import ReactQueryKeys from '../constants/apikeys.constant'

export const useGetAllCategories = () => {
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

export const useGetCategoryById = (
    id: string,
    options?: Omit<
        UseQueryOptions<TAPIResponseItem<Category>>,
        'queryKey' | 'queryFn'
    >,
) => {
    const query = useQuery<TAPIResponseItem<Category>>({
        queryKey: [ReactQueryKeys.CATEGORY_BY_ID, id],
        queryFn: () => CategoriesServices.getCategoryById(id),
        ...options,
    })

    return {
        ...query,
        category: query.data?.data ?? null,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetCategoriesTree = () => {
    const query = useQuery<TAPIResponseItem<CategoryTreeNode[]>>({
        queryKey: [ReactQueryKeys.CATEGORIES_TREE],
        queryFn: () => CategoriesServices.getCategoriesTree(),
    })

    return {
        ...query,
        tree: query.data?.data ?? [],
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useCreateCategory = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        TAPIResponseItem<Category>,
        Error,
        CategoryPayload
    >({
        mutationFn: (payload: CategoryPayload) =>
            CategoriesServices.createCategory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CATEGORIES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORIES_TREE],
            })
        },
    })

    return {
        ...mutation,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        TAPIResponseItem<Category>,
        Error,
        { id: string; payload: CategoryPayload }
    >({
        mutationFn: ({ id, payload }) =>
            CategoriesServices.updateCategory(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CATEGORIES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORIES_TREE],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORY_BY_ID, variables.id],
            })
        },
    })

    return {
        ...mutation,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useSoftDeleteCategory = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Category>, Error, string>({
        mutationFn: (id: string) => CategoriesServices.softDeleteCategory(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CATEGORIES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORIES_TREE],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORY_BY_ID, id],
            })
        },
    })

    return {
        ...mutation,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useHardDeleteCategory = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation<
        TAPIResponseItem<Category>,
        Error,
        { id: string; targetCategoryId: string }
    >({
        mutationFn: (variables) => CategoriesServices.hardDeleteCategory(variables),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CATEGORIES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORIES_TREE],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORY_BY_ID, variables.id],
            })
        },
    })

    return {
        ...mutation,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useRestoreCategory = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Category>, Error, string>({
        mutationFn: (id: string) => CategoriesServices.restoreCategory(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CATEGORIES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORIES_TREE],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORY_BY_ID, id],
            })
        },
    })

    return {
        ...mutation,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useActivateCategory = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Category>, Error, string>({
        mutationFn: (id: string) => CategoriesServices.activateCategory(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CATEGORIES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORIES_TREE],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORY_BY_ID, id],
            })
        },
    })

    return {
        ...mutation,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useDeactivateCategory = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Category>, Error, string>({
        mutationFn: (id: string) => CategoriesServices.deactivateCategory(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_CATEGORIES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORIES_TREE],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.CATEGORY_BY_ID, id],
            })
        },
    })

    return {
        ...mutation,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export function useGetAllCategoriesSelect(search?: string, level?: number) {
    return useInfiniteQuery({
        queryKey: ['optionsCategories', search, level],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            CategoriesServices.getInfinityCategories(
                pageParam as number,
                10,
                search,
                level,
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
