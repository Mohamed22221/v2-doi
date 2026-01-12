import { TAPIResponse } from '../types/api'
import {
    LoginRequest,
    LoginResponse,
    ProfileResponse,
    RequestChangePassword,
    RequestForgotPassword,
    RequestNewPassword,
    ResendOtpRequest,
    ResponseForgotPassword,
    VerifyForgotOtpRequest,
    VerifyForgotOtpResponse,
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
    verifyForgotOtp: (
        payload: VerifyForgotOtpRequest,
    ): Promise<TAPIResponse<VerifyForgotOtpResponse>> => {
        return api.post('/auth/verify-forgot-otp', payload)
    },
    resendOtp: (
        payload: ResendOtpRequest,
    ): Promise<TAPIResponse<VerifyOtpRequest>> => {
        return api.post('/auth/resend-otp', payload)
    },
    changePassword: (payload: RequestChangePassword) => {
        return api.post('/auth/change-password', payload)
    },
    forgotPassword: (
        payload: RequestForgotPassword,
    ): Promise<TAPIResponse<ResponseForgotPassword>> => {
        return api.post('/auth/forgot-password', payload)
    },
    resetPassword: (payload: RequestNewPassword) => {
        return api.post('/auth/reset-password', payload)
    },

    getProfile: () => api.get<ProfileResponse>('/auth/profile'),
}

export default AuthServices
