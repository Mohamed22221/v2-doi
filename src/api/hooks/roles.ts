import { useQuery } from '@tanstack/react-query'
import ReactQueryKeys from '../constants/apikeys.constant'
import { getApiErrorMessage } from '../error'
import type { TAPIResponseItems } from '../types/api'
import { Role } from '../types/roles'
import RolesServices from '../services/roles'

export const useGetAllRolesSelect = () => {
    const query = useQuery<TAPIResponseItems<Role[]>>({
        queryKey: [ReactQueryKeys.ALL_USERS],
        queryFn: () => RolesServices.getAllRoles(),
    })

    return {
        ...query,
        roles: query.data?.data?.items ?? [],
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}
