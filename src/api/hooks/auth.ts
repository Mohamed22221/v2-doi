// External libraries
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Cookies from 'js-cookie'
// Internal constants & services
import AuthServices from '../services/auth'
import ReactQueryKeys from '../constants/apikeys.constant'
import { ACCESS_TOKEN } from '../constants/api.constant'
import { getApiErrorMessage } from '../error'
import { LoginResponse, VerifyOtpResponse } from '../types/auth'

// Helpers to set cookies
const setAccessTokenCookie = (token: string) => {
    Cookies.set(ACCESS_TOKEN, token, {
        expires: 1 / 96, // 15 minutes
        sameSite: 'strict',
        secure: true,
    })
}

// Hook login and handle errors
export const useLogin = () => {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.SIGN_IN],
        mutationFn: AuthServices.login,

        onSuccess: async ({ data }: { data: LoginResponse }) => {
            const accessToken = data?.access_token

            // 1) OTP flow
            if (data?.code) {
                localStorage.setItem("otp-code", data.code);
                localStorage.setItem("otp-session-id", data.otpSessionId || "");
                navigate('/verify-otp', { replace: false })
                return
            }

            // 2) Token flow
            if (accessToken) {
                setAccessTokenCookie(accessToken)
                navigate('/', { replace: true })

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
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.VERIFY_OTP],
        mutationFn: AuthServices.verifyOtp,

        onSuccess: async ({ data }: { data: VerifyOtpResponse }) => {
            const accessToken = data?.access_token
            if (!accessToken) return;
            // 2) Token flow
            if (accessToken) {
                setAccessTokenCookie(accessToken)
                navigate('/', { replace: true })

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
export const useGetProfile = () => {
    return useQuery({
        queryKey: [ReactQueryKeys.GET_PROFILE],
        queryFn: AuthServices.getProfile,
    })
}
