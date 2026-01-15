import { TAPIResponseItems } from '../types/api'
import { Role } from '../types/roles'
import api from '../api'


const RolesServices = {
    getAllRoles: (

    ): Promise<TAPIResponseItems<Role[]>> =>
        api.get(`/admin/roles`),
}

export default RolesServices
