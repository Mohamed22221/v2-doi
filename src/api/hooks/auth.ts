// External libraries
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Cookies from 'js-cookie'
// Internal constants & services
import AuthServices from '../services/auth'
import ReactQueryKeys from '../constants/apikeys.constant'
import { ACCESS_TOKEN } from '../constants/api.constant'
import { getApiErrorMessage } from '../error'
import { LoginResponse } from '../types/auth'

// Helpers to set cookies
const setAccessTokenCookie = (token: string) => {
    Cookies.set(ACCESS_TOKEN, token, {
        expires: 1 / 96,// 15 minutes
        sameSite: 'strict',
        secure: true,
    })
}

// Hook login and handle errors
export const useLogin = () => {
    const navigate = useNavigate()

    const mutation = useMutation({
        mutationKey: [ReactQueryKeys.SIGN_IN],
        mutationFn: AuthServices.login,
        onSuccess: ({ data }: { data: LoginResponse }) => {
            const accessToken = data?.access_token
            if (!accessToken) return

            setAccessTokenCookie(accessToken)
            navigate('/', { replace: true })
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
