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
import { Model, ModelPayload } from '../types/models'
import ModelsServices from '../services/models'
import ReactQueryKeys from '../constants/apikeys.constant'

export const useGetAllModels = () => {
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const query = useQuery<TAPIResponseItems<Model[]>>({
        queryKey: [ReactQueryKeys.ALL_MODELS, queryString],
        queryFn: () => ModelsServices.getModels(queryString),
    })

    return {
        ...query,
        models: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetModelById = (
    id: string,
    options?: Omit<
        UseQueryOptions<TAPIResponseItem<Model>>,
        'queryKey' | 'queryFn'
    >,
) => {
    const query = useQuery<TAPIResponseItem<Model>>({
        queryKey: [ReactQueryKeys.MODEL_BY_ID, id],
        queryFn: () => ModelsServices.getModelById(id),
        ...options,
    })

    return {
        ...query,
        model: query.data?.data ?? null,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useCreateModel = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Model>, Error, ModelPayload>({
        mutationFn: (payload: ModelPayload) =>
            ModelsServices.createModel(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_MODELS],
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

export const useUpdateModel = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        TAPIResponseItem<Model>,
        Error,
        { id: string; payload: ModelPayload }
    >({
        mutationFn: ({ id, payload }) =>
            ModelsServices.updateModel(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_MODELS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.MODEL_BY_ID, variables.id],
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

export const useSoftDeleteModel = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Model>, Error, string>({
        mutationFn: (id: string) => ModelsServices.deleteModel(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_MODELS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.MODEL_BY_ID, id],
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

export const useHardDeleteModel = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Model>, Error, string>({
        mutationFn: (id: string) => ModelsServices.hardDeleteModel(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_MODELS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.MODEL_BY_ID, id],
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

export const useRestoreModel = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Model>, Error, string>({
        mutationFn: (id: string) => ModelsServices.restoreModel(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_MODELS],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.MODEL_BY_ID, id],
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

export function useGetAllModelsSelect() {
    return useInfiniteQuery({
        queryKey: ['optionsModals'],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            ModelsServices.getInfinityModels(pageParam as number),
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
