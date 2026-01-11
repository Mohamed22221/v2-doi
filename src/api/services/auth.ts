import { TAPIResponse } from '../types/api'
import { LoginRequest, LoginResponse } from '../types/auth'
import api from '../api'

const AuthServices = {
    login: (payload: LoginRequest): Promise<TAPIResponse<LoginResponse>> => {
        return api.post('/auth/login', payload)
    },
}

export default AuthServices
