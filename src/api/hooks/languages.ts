import { useInfiniteQuery } from '@tanstack/react-query'
import LanguageServices from '../services/language'
import ReactQueryKeys from '../constants/apikeys.constant'

export function useInfiniteLanguages() {
    return useInfiniteQuery({
        queryKey: [ReactQueryKeys.INFINITY_lANGUAGES],
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            LanguageServices.getInfinityLanguages(pageParam),
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
