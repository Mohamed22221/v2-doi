// External libraries
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'

// Internal constants & services
import AuthServices from '../services/auth'
import ReactQueryKeys from '../constants/apikeys.constant'
import { ACCESS_TOKEN } from '../constants/api.constant'
import { getApiErrorMessage } from '../error'
import {
    LoginResponse,
    ResponseForgotPassword,
    VerifyForgotOtpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
} from '../types/auth'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'
import useQueryLocation from '@/utils/useQueryLocation'
import { useAppSelector } from '@/store'

// Helpers to set cookies
const setAccessTokenCookie = (token: string) => {
    Cookies.set(ACCESS_TOKEN, token, {
        expires: 1 / 96,
        sameSite: 'lax',
        secure: false, // مهم
        path: '/',
    })
}

// Hook login and handle errors
export const useLogin = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const query = useQueryLocation()
    const redirectUrl = query.get(REDIRECT_URL_KEY)

    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.SIGN_IN],
        mutationFn: AuthServices.login,

        onSuccess: async ({ data }: { data: LoginResponse }) => {
            const accessToken = data?.access_token

            // 1) OTP flow
            if (data?.code) {
                localStorage.setItem('otp-code', data.code)
                localStorage.setItem('otp-session-id', data.otpSessionId || '')

                navigate(
                    redirectUrl
                        ? '/verify-otp?redirectUrl=' + redirectUrl
                        : '/verify-otp',
                )
                return
            }

            // 2) Token flow
            if (accessToken) {
                queryClient.clear()
                setAccessTokenCookie(accessToken)
                navigate(
                    redirectUrl
                        ? redirectUrl
                        : appConfig.authenticatedEntryPath,
                    { replace: true },
                )

                return
            }
        },
    })

    return {
        ...mutation,
        login: mutation.mutateAsync,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useVerifyOtp = () => {
    const navigate = useNavigate()
    const query = useQueryLocation()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.VERIFY_OTP],
        mutationFn: AuthServices.verifyOtp,

        onSuccess: async ({ data }: { data: VerifyOtpResponse }) => {
            const accessToken = data?.access_token
            if (!accessToken) return
            // 2) Token flow
            if (accessToken) {
                queryClient.clear()
                setAccessTokenCookie(accessToken)
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl
                        ? redirectUrl
                        : appConfig.authenticatedEntryPath,
                )

                return
            }
        },
    })

    return {
        ...mutation,
        verifyOtp: mutation.mutateAsync,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useVerifyForgotOtp = () => {
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.VERIFY_OTP],
        mutationFn: AuthServices.verifyForgotOtp,

        onSuccess: async ({ data }: { data: VerifyForgotOtpResponse }) => {
            const resetToken = data?.resetToken
            if (!resetToken) return
            // 2) Token flow
            if (resetToken) {
                navigate('/new-password', {
                    state: {
                        resetToken: resetToken,
                    },
                })

                return
            }
        },
    })

    return {
        ...mutation,
        verifyForgotOtp: mutation.mutateAsync,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useResendOtp = () => {
    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.RESEND_OTP],
        mutationFn: AuthServices.resendOtp,
        onSuccess: async ({ data }: { data: VerifyOtpRequest }) => {
            localStorage.setItem('otp-code', data?.code)
            localStorage.setItem('otp-session-id', data.otpSessionId || '')
        },
    })

    return {
        ...mutation,
        resendOtp: mutation.mutateAsync,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useForgotPassword = () => {
    const navigate = useNavigate()
    const query = useQueryLocation()
    const redirectUrl = query.get(REDIRECT_URL_KEY)
    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.FORGOT_PASSWORD],
        mutationFn: AuthServices.forgotPassword,

        onSuccess: async ({ data }: { data: ResponseForgotPassword }) => {
            const otpSessionId = data
            if (!otpSessionId) return
            localStorage.setItem('otp-code', data.code)
            localStorage.setItem('otp-session-id', data.otpSessionId)
            navigate('/verify-otp', {
                state: {
                    otp: 'forgot',
                    redirectUrl,
                },
            })
        },
    })

    return {
        ...mutation,
        forgotPassword: mutation.mutateAsync,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useNewPassword = () => {
    const navigate = useNavigate()
    const query = useQueryLocation()
    const redirectUrl = query.get(REDIRECT_URL_KEY)
    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.RESET_PASSWORD],
        mutationFn: AuthServices.resetPassword,

        onSuccess: async () => {
            navigate('sign-in', {
                state: {
                    redirectUrl,
                },
            })
        },
    })

    return {
        ...mutation,
        newPassword: mutation.mutateAsync,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useChangePassword = () => {
    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.CHANGE_PASSWORD],
        mutationFn: AuthServices.changePassword,
    })

    return {
        ...mutation,
        changePassword: mutation.mutateAsync,
        errorMessage: mutation.error
            ? getApiErrorMessage(mutation.error)
            : null,
    }
}

export const useGetProfile = () => {
    const lang = useAppSelector((state) => state.locale.currentLang)
    return useQuery({
        queryKey: [ReactQueryKeys.GET_PROFILE, lang],
        queryFn: AuthServices.getProfile,
    })
}
