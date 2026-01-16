import { TAPIResponseItem, TAPIResponseItems } from '../types/api'
import { UserItem } from '../types/users'
import api from '../api'

const UsersServices = {
    getAllUsers: (
        searchParams: string,
    ): Promise<TAPIResponseItems<UserItem[]>> =>
        api.get(`/admin/users?${searchParams}`),

    getUserDetails: (id: number | string): Promise<TAPIResponseItem<UserItem>> =>
        api.get(`/admin/users/${id}`),
}

export default UsersServices
