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
import { Language, LanguagePayload } from '../types/languages'
import LanguagesServices from '../services/languages'
import ReactQueryKeys from '../constants/apikeys.constant'
import { useAppSelector } from '@/store'

export const useGetAllLanguages = () => {
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const lang = useAppSelector((state) => state.locale.currentLang)
    const query = useQuery<TAPIResponseItems<Language[]>>({
        queryKey: [ReactQueryKeys.ALL_LANGUAGES, queryString, lang],
        queryFn: () => LanguagesServices.getLanguages(queryString),
    })

    return {
        ...query,
        languages: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetLanguageById = (
    id: string,
    options?: Omit<
        UseQueryOptions<TAPIResponseItem<Language>>,
        'queryKey' | 'queryFn'
    >,
) => {
    const lang = useAppSelector((state) => state.locale.currentLang)
    const query = useQuery<TAPIResponseItem<Language>>({
        queryKey: [ReactQueryKeys.LANGUAGE_BY_ID, id, lang],
        queryFn: () => LanguagesServices.getLanguageById(id),
        ...options,
    })

    return {
        ...query,
        language: query.data?.data ?? null,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useCreateLanguage = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        TAPIResponseItem<Language>,
        Error,
        LanguagePayload
    >({
        mutationFn: (payload: LanguagePayload) =>
            LanguagesServices.createLanguage(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_LANGUAGES],
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

export const useUpdateLanguage = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<
        TAPIResponseItem<Language>,
        Error,
        { id: string; payload: LanguagePayload }
    >({
        mutationFn: ({ id, payload }) =>
            LanguagesServices.updateLanguage(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_LANGUAGES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.LANGUAGE_BY_ID, variables.id],
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

export const useDeleteLanguage = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Language>, Error, string>({
        mutationFn: (id: string) => LanguagesServices.deleteLanguage(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_LANGUAGES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.LANGUAGE_BY_ID, id],
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

export const useHardDeleteLanguage = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Language>, Error, { id: string | number }>({
        mutationFn: ({ id }) => LanguagesServices.hardDeleteLanguage(id.toString()),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_LANGUAGES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.LANGUAGE_BY_ID, variables.id.toString()],
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

export const useRestoreLanguage = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Language>, Error, string>({
        mutationFn: (id: string) => LanguagesServices.restoreLanguage(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_LANGUAGES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.LANGUAGE_BY_ID, id],
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

export const useActivateLanguage = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Language>, Error, string>({
        mutationFn: (id: string) => LanguagesServices.activateLanguage(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_LANGUAGES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.LANGUAGE_BY_ID, id],
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

export const useDeactivateLanguage = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation<TAPIResponseItem<Language>, Error, string>({
        mutationFn: (id: string) => LanguagesServices.deactivateLanguage(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_LANGUAGES],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.LANGUAGE_BY_ID, id],
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

export function useInfiniteLanguages() {
    const lang = useAppSelector((state) => state.locale.currentLang)
    return useInfiniteQuery({
        queryKey: [ReactQueryKeys.ALL_LANGUAGES, 'infinite', lang],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            LanguagesServices.getInfinityLanguages(pageParam as number),
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
