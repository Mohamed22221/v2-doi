import { Platform } from '@/@types/common'

export type OtpSessionId = string

export type LoginRequest = {
    email?: string
    phone?: string
    password: string
    fcmToken?: string
    platform?: Platform
}

export type LoginResponse = {
    access_token: string
    otpSessionId?: OtpSessionId
    code?: string
    user: {
        id: string
        email: string
        phone: string
        language: string
    }
}

export type VerifyOtpRequest = {
    code: string
    otpSessionId: string
}

export type VerifyOtpResponse = {
    access_token: string
    user: LoginResponse['user']
}
export type ResendOtpRequest = {
    otpSessionId: OtpSessionId
}
export type ProfileResponse = {
    sub: string
    phone: string
    email: string
    role: string
}

export type RequestChangePassword = {
    oldPassword: string
    newPassword: string
}

export type RequestForgotPassword = {
    phone: string
}
export type ResponseForgotPassword = {

        code: string
        otpSessionId: string
    
}
export type VerifyForgotOtpRequest = {
    phone: string
    otp: string
    sessionId: string
}

export type VerifyForgotOtpResponse = {
resetToken: string
}

export type RequestNewPassword = {
    token: string
    newPassword: string
}
