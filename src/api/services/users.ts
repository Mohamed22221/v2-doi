import { TAPIResponseItem, TAPIResponseItems } from '../types/api'
import { UserItem } from '../types/users'
import api from '../api'

const UsersServices = {
    getAllUsers: (
        searchParams: string,
    ): Promise<TAPIResponseItems<UserItem[]>> =>
        api.get(`/admin/users?${searchParams}`),

    getUserDetails: (
        id: number | string,
    ): Promise<TAPIResponseItem<UserItem>> => api.get(`/admin/users/${id}`),

    toggleUserStatus: (
        id: number | string,
        isActive: boolean,
    ): Promise<TAPIResponseItem<UserItem>> =>
        api.patch(`/admin/users/${id}/${isActive ? 'deactivate' : 'activate'}`),

    softDeleteUser: (id: number | string) => api.delete(`/admin/users/${id}`),

    hardDeleteUser: (id: number | string) =>
        api.delete(`/admin/users/${id}/hard`),

    restoreDeleteUser: (id: number | string) =>
        api.patch(`/admin/users/${id}/restore`),
}

export default UsersServices
