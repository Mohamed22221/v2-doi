import { QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { ApiErrorClass } from './error'

/**
 * Extracts HTTP status from either raw Axios error or our custom ApiErrorClass
 */
function getStatus(err: unknown): number | undefined {
    if (err instanceof ApiErrorClass) {
        return err.status
    }
    const e = err as AxiosError
    return e?.response?.status
}

/**
 * Detects network errors (no response)
 */
function isNetworkError(err: unknown): boolean {
    if (err instanceof ApiErrorClass) {
        // Our normalization sets code but no status for network errors
        return !err.status && !!err.code
    }
    const e = err as any
    return !!e && e?.response == null && e?.request != null
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Intelligent retry logic
            retry: (failureCount, error) => {
                const status = getStatus(error)

                // 1) Network error → Retry up to 2 times
                if (isNetworkError(error)) return failureCount < 2

                // 2) Non-retryable permanent errors
                if (status && [400, 401, 403, 404].includes(status)) return false

                // 3) Transient server errors → Retry up to 3 times
                if (status && [500, 502, 503, 504].includes(status)) {
                    return failureCount < 2
                }

                // 4) Default: retry once for other unknown errors
                return failureCount < 1
            },

            // Exponential backoff (max 10s)
            retryDelay: (attemptIndex) =>
                Math.min(1000 * 2 ** attemptIndex, 10_000),

            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            staleTime: 30_000, // 30 seconds
        },

        mutations: {
            // Avoid retrying mutations to prevent duplicate side effects
            retry: false,
        },
    },
})

export default queryClient