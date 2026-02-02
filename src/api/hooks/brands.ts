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
import { Brand, BrandPayload } from '../types/brands'
import BrandsServices from '../services/brands'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useAppSelector } from '@/store'

export const useGetAllBrands = () => {
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const lang = useAppSelector((state) => state.locale.currentLang)
    const query = useQuery<TAPIResponseItems<Brand[]>>({
        queryKey: [ReactQueryKeys.ALL_BRANDS, queryString, lang],
        queryFn: () => BrandsServices.getBrands(queryString),
    })

    return {
        ...query,
        brands: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetBrandById = (
    id: string,
    options?: Omit<
        UseQueryOptions<TAPIResponseItem<Brand>>,
        'queryKey' | 'queryFn'
    >,
) => {
    const lang = useAppSelector((state) => state.locale.currentLang)
    const query = useQuery<TAPIResponseItem<Brand>>({
        queryKey: [ReactQueryKeys.BRAND_BY_ID, id, lang],
        queryFn: () => BrandsServices.getBrandById(id),
        ...options,
    })

    return {
        ...query,
        brand: query.data?.data ?? null,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useCreateBrand = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Brand>, Error, BrandPayload>({
        mutationFn: (payload: BrandPayload) =>
            BrandsServices.createBrand(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_BRANDS],
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

export const useUpdateBrand = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        TAPIResponseItem<Brand>,
        Error,
        { id: string; payload: BrandPayload }
    >({
        mutationFn: ({ id, payload }) =>
            BrandsServices.updateBrand(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_BRANDS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.BRAND_BY_ID, variables.id],
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

export const useSoftDeleteBrand = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Brand>, Error, string>({
        mutationFn: (id: string) => BrandsServices.deleteBrand(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_BRANDS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.BRAND_BY_ID, id],
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

export const useHardDeleteBrand = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Brand>, Error, string>({
        mutationFn: (id: string) => BrandsServices.hardDeleteBrand(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_BRANDS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.BRAND_BY_ID, id],
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

export const useRestoreBrand = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Brand>, Error, string>({
        mutationFn: (id: string) => BrandsServices.restoreBrand(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_BRANDS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.BRAND_BY_ID, id],
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

export const useActivateBrand = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Brand>, Error, string>({
        mutationFn: (id: string) => BrandsServices.activateBrand(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_BRANDS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.BRAND_BY_ID, id],
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

export const useDeactivateBrand = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Brand>, Error, string>({
        mutationFn: (id: string) => BrandsServices.deactivateBrand(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_BRANDS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.BRAND_BY_ID, id],
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

export function useGetAllBrandsSelect(search?: string) {
    const lang = useAppSelector((state) => state.locale.currentLang)
    return useInfiniteQuery({
        queryKey: ['optionsBrands', search, lang],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            BrandsServices.getInfinityBrands(pageParam as number, 10, search),
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
