import { TAPIResponse } from '../types/api'
import {
    LoginRequest,
    LoginResponse,
    ProfileResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
} from '../types/auth'
import api from '../api'

const AuthServices = {
    login: (payload: LoginRequest): Promise<TAPIResponse<LoginResponse>> => {
        return api.post('/auth/login', payload)
    },
    verifyOtp: (
        payload: VerifyOtpRequest,
    ): Promise<TAPIResponse<VerifyOtpResponse>> => {
        return api.post('/auth/verify-otp', payload)
    },
    getProfile: () => api.get<ProfileResponse>('/auth/profile'),
}

export default AuthServices
