import { TAPIResponse } from '../types/api'
import { LoginRequest, LoginResponse, ProfileResponse } from '../types/auth'
import api from '../api'

const AuthServices = {
    login: (payload: LoginRequest): Promise<TAPIResponse<LoginResponse>> => {
        return api.post('/auth/login', payload)
    },
    getProfile: () =>
        api.get<ProfileResponse>('/auth/profile'),
}

export default AuthServices
