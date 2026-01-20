import { TAPIResponseItems } from '../types/api'
import { Role } from '../types/roles'
import api from '../api'

const RolesServices = {
    // getAllRoles: (): Promise<TAPIResponseItems<Role[]>> =>
    //     api.get(`/admin/roles`),
    getInfinityRoles: (
        page: number,
        limit = 10,
    ): Promise<TAPIResponseItems<Role[]>> =>
        api.get(`/admin/roles?page=${page ? page : 1}&limit=${limit}`),
}

export default RolesServices
