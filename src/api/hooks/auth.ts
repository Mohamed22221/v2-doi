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
    VerifyOtpRequest,
    VerifyOtpResponse,
} from '../types/auth'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import appConfig from '@/configs/app.config'
import useQueryLocation from '@/utils/useQueryLocation'

// Helpers to set cookies
const setAccessTokenCookie = (token: string) => {
    Cookies.set(ACCESS_TOKEN, token, {
        expires: 1 / 2880, // 15 minutes
        sameSite: 'strict',
        secure: true,
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
                setAccessTokenCookie(accessToken)
                navigate(
                    redirectUrl
                        ? redirectUrl
                        : appConfig.authenticatedEntryPath,
                    { replace: true },
                )

                await queryClient.invalidateQueries({
                    queryKey: [ReactQueryKeys.GET_PROFILE],
                })
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
                setAccessTokenCookie(accessToken)
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl
                        ? redirectUrl
                        : appConfig.authenticatedEntryPath,
                )

                await queryClient.invalidateQueries({
                    queryKey: [ReactQueryKeys.GET_PROFILE],
                })
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
    return useQuery({
        queryKey: [ReactQueryKeys.GET_PROFILE],
        queryFn: AuthServices.getProfile,
    })
}
