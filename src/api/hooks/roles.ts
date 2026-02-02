import { useInfiniteQuery } from '@tanstack/react-query'
// import ReactQueryKeys from '../constants/apikeys.constant'
// import { getApiErrorMessage } from '../error'
// import type { TAPIResponseItems } from '../types/api'
// import { Role } from '../types/roles'
import RolesServices from '../services/roles'
import { useAppSelector } from '@/store'

// export const useGetAllRolesSelect = () => {
//     const query = useQuery<TAPIResponseItems<Role[]>>({
//         queryKey: [ReactQueryKeys.ALL_USERS],
//         queryFn: () => RolesServices.getAllRoles(),
//     })

//     return {
//         ...query,
//         roles: query.data?.data?.items ?? [],
//         errorMessage: query.error ? getApiErrorMessage(query.error) : null,
//     }
// }

export function useInfiniteRoles() {
    const lang = useAppSelector((state) => state.locale.currentLang)
    return useInfiniteQuery({
        queryKey: ['optionsRoles', lang],
        initialPageParam: 1,
        queryFn: ({ pageParam }) => RolesServices.getInfinityRoles(pageParam),
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
