import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import ReactQueryKeys from '../constants/apikeys.constant'
import UsersServices from '../services/users'
import { getApiErrorMessage } from '../error'
import type { TAPIResponseItems } from '../types/api' // عدّل المسار حسب مشروعك
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
