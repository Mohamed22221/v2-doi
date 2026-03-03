// api.ts — Axios instance with refresh-token interceptor (improved)
import axios, {
    AxiosResponse,
    InternalAxiosRequestConfig,
    AxiosError,
} from 'axios'
import { TOKEN_TYPE } from './constants/api.constant'
import { ApiErrorClass, normalizeApiError } from './error'
import { API_URL, API_VERSION } from '@/configs/env'
import store from '@/store'
import {
    signOutSuccess,
    tokenUpdated,
} from '@/store/slices/auth/sessionSlice'
import i18n from '@/locales'

// ────────────────────────────────────────────
// Axios instances
// ────────────────────────────────────────────
export const api = axios.create({
    baseURL: `${API_URL}/${API_VERSION}`,
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    timeout: 30000, // 30 seconds default timeout
})

// Clean instance for refresh (no interceptors)
const authApi = axios.create({
    baseURL: `${API_URL}/${API_VERSION}`,
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    timeout: 10000,
})

// ────────────────────────────────────────────
// Refresh-token concurrency helper
// ────────────────────────────────────────────
let refreshPromise: Promise<string> | null = null

async function doRefresh(): Promise<string> {
    const { refreshToken } = store.getState().auth.session
    if (!refreshToken) throw new Error('No refresh token available')

    const res = await authApi.post(
        '/auth/refresh',
        {},
        { headers: { Authorization: `Bearer ${refreshToken}` } },
    )

    const data = res.data?.data || res.data
    const newAccessToken: string | undefined = data?.access_token
    const newRefreshToken: string | undefined = data?.refresh_token

    if (!newAccessToken) throw new Error('Refresh response missing access_token')

    store.dispatch(
        tokenUpdated({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        }),
    )

    return newAccessToken
}

// ────────────────────────────────────────────
// Request interceptor
// ────────────────────────────────────────────
function onRequest(config: InternalAxiosRequestConfig) {
    config.headers = config.headers ?? {}

    if (!config.headers.Authorization) {
        const { accessToken } = store.getState().auth.session
        if (accessToken) config.headers.Authorization = `${TOKEN_TYPE}${accessToken}`
    }

    const lang = store.getState().locale.currentLang || 'ar'
    config.headers.set('x-language', lang)

    return config
}

// ────────────────────────────────────────────
// Response interceptor — success
// ────────────────────────────────────────────
async function onResponse(res: AxiosResponse) {
    const url = res.config.url || ''
    const isLoginResponse = url.includes('/auth/login') || url.includes('/auth/verify-otp')

    const data = res.data?.data || res.data
    const accessToken = data?.access_token

    if (isLoginResponse && accessToken) {
        try {
            const profileRes = await authApi.get('/auth/profile', {
                headers: { Authorization: `Bearer ${accessToken}` }
            })

            const profileData = profileRes.data?.data || profileRes.data
            const role = profileData?.role

            if (role !== 'Administrator') {
                return Promise.reject(new ApiErrorClass({
                    message: i18n.t('auth.errors.administratorOnly'),
                    status: 403,
                }))
            }
        } catch (error) {
            return Promise.reject(new ApiErrorClass(normalizeApiError(error)))
        }
    }

    return res.data
}

function isCanceled(error: unknown): boolean {
    return axios.isCancel(error)
}

// ────────────────────────────────────────────
// Response interceptor — error (refresh logic)
// ────────────────────────────────────────────
let isRedirecting = false

async function onResponseError(error: unknown) {
    if (isCanceled(error)) return Promise.reject(error)

    if (!axios.isAxiosError(error)) {
        return Promise.reject(new ApiErrorClass(normalizeApiError(error)))
    }

    const axiosError = error as AxiosError
    const status = axiosError.response?.status
    const originalRequest = (axiosError.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined)

    if (!originalRequest) {
        return Promise.reject(new ApiErrorClass(normalizeApiError(error)))
    }

    const url = originalRequest.url ?? ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/verify-otp')

    if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
        originalRequest._retry = true
        const { refreshToken } = store.getState().auth.session
        if (!refreshToken) {
            handleAuthFailure()
            return Promise.reject(error)
        }

        try {
            if (!refreshPromise) {
                refreshPromise = doRefresh().finally(() => {
                    refreshPromise = null
                })
            }
            const newToken = await refreshPromise
            originalRequest.headers = originalRequest.headers ?? {}
            originalRequest.headers.Authorization = `${TOKEN_TYPE}${newToken}`
            return api.request(originalRequest)
        } catch (refreshError) {
            handleAuthFailure()
            return Promise.reject(refreshError)
        }
    }

    return Promise.reject(new ApiErrorClass(normalizeApiError(error)))
}

function handleAuthFailure() {
    store.dispatch(signOutSuccess())
    if (typeof window === 'undefined') return
    const isSignInPage = window.location.pathname.includes('/sign-in')
    if (!isSignInPage && !isRedirecting) {
        isRedirecting = true
        window.location.replace('/sign-in')
    }
}

api.interceptors.request.use(onRequest)
api.interceptors.response.use(onResponse, onResponseError)

export default api