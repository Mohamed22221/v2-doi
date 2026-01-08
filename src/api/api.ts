// api.ts (axios setup)
import axios, {
    AxiosError,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios'
import Cookies from 'js-cookie'
// import { toast } from "react-toastify";
import { ACCESS_TOKEN , TOKEN_TYPE } from './constants/api.constant'

const apiVersion = 'v1'
const apiUrl = `https://doueh.com/api`

const api = axios.create({
    baseURL: `${apiUrl}/${apiVersion}`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
})

// Request queue during refresh
let isRefreshing = false
let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
}> = []

const processQueue = (
    error: AxiosError | null,
    token: string | null = null,
) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error)
        else prom.resolve(token)
    })
    failedQueue = []
}

function onRequest(config: InternalAxiosRequestConfig) {
    config.headers.Authorization = `${TOKEN_TYPE}${Cookies.get(ACCESS_TOKEN)}`
    config.headers['lang'] = localStorage.getItem('i18nextLng')
    return config
}

function onResponse(res: AxiosResponse): AxiosResponse['data'] {
    return res?.data
}

async function errorHandler(
    error: AxiosError<{ error: { message: string; details: string[] } }>,
) {
    const originalRequest = error.config as
        | (InternalAxiosRequestConfig & {
              _retry?: boolean
          })
        | undefined
    const status = error.response?.status
    const errorMsg =
        error.response?.data?.error?.message || 'Unexpected API error'

    // Handle 401 with refresh flow
    if (status === 401 && originalRequest && !originalRequest._retry) {
        if (isRefreshing) {
            // Queue until refresh finishes
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
            })
                .then(() => api(originalRequest))
                .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
            // Call refresh endpoint (cookies carry refresh token)
            const resp = await axios.post(
                `${apiUrl}/${apiVersion}/auth/refresh-token`,
                {},
                { withCredentials: true },
            )
            const newAccessToken = resp.data?.data?.accessToken

            if (newAccessToken) {
                Cookies.set(ACCESS_TOKEN, newAccessToken, {
                    expires: 1 / 96,
                })
                api.defaults.headers.common.Authorization = `${TOKEN_TYPE}${newAccessToken}`
                if (originalRequest.headers)
                    originalRequest.headers.Authorization = `${TOKEN_TYPE}${newAccessToken}`

                processQueue(null, newAccessToken)
                return api(originalRequest)
            }

            throw new Error('No access token returned from refresh')
        } catch (refreshErr) {
            processQueue(refreshErr as AxiosError, null)
            Cookies.remove(ACCESS_TOKEN)
            window.location.href = '/auth/sign-in'
            return Promise.reject(refreshErr)
        } finally {
            isRefreshing = false
        }
    }

    // Notify
    //   toast.error(errorMsg, { toastId: errorMsg });
    //   error.response?.data?.error.details?.map((item) =>
    //     toast.error(item, { toastId: item })
    //   );

    // ...existing code to build custom error...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customError: any = new Error(errorMsg)
    customError.isApiError = true
    customError.status = status
    customError.original = error

    return Promise.reject(customError)
}

api.interceptors.request.use(onRequest, errorHandler)
api.interceptors.response.use(onResponse, errorHandler)

export default api
