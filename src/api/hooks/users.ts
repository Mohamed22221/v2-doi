import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import ReactQueryKeys from '../constants/apikeys.constant'
import UsersServices from '../services/users'
import { getApiErrorMessage } from '../error'
import type { TAPIResponseItems } from '../types/api'
import { UserItem } from '../types/users'

export const useGetAllUsers = () => {
    const [searchParams] = useSearchParams()
    const queryString = searchParams.toString()

    const query = useQuery<TAPIResponseItems<UserItem[]>>({
        queryKey: [ReactQueryKeys.ALL_USERS, queryString],
        queryFn: () => UsersServices.getAllUsers(queryString),
    })

    return {
        ...query,
        users: query.data?.data?.items ?? [],
        total: query.data?.data?.total ?? 0,
        page: query.data?.data?.page ?? 1,
        limit: query.data?.data?.limit ?? 10,
        totalPages: query.data?.data?.totalPages ?? 1,
        errorMessage: query.error ? getApiErrorMessage(query.error) : null,
    }
}

export const useGetUserDetails = (id: number | string) => {
    return useQuery({
        queryKey: [ReactQueryKeys.GET_USER_DETAILS, id],
        queryFn: () => UsersServices.getUserDetails(id),
    })
}

export const useToggleUserStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            isActive,
        }: {
            id: number | string
            isActive: boolean
        }) => UsersServices.toggleUserStatus(id, isActive),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_USER_DETAILS],
            })
        },
    })
}

export const useSoftDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id }: { id: number | string }) =>
            UsersServices.softDeleteUser(id),

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.GET_USER_DETAILS, variables.id],
            })
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_USERS],
            })
        },
    })
}

export const useHardDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id }: { id: number | string }) =>
            UsersServices.hardDeleteUser(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ReactQueryKeys.ALL_USERS],
            })
        },
    })
}
