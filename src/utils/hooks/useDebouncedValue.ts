import { useEffect, useState } from 'react'

/**
 * Returns a debounced version of the provided value.
 * The debounced value will only update after the specified delay
 * has passed without the value changing.
 *
 * @param value - The value to debounce
 * @param delayMs - The delay in milliseconds (default: 400ms)
 * @returns The debounced value
 */
function useDebouncedValue<T>(value: T, delayMs: number = 400): T {
    const [debounced, setDebounced] = useState<T>(value)

    useEffect(() => {
        const id = window.setTimeout(() => setDebounced(value), delayMs)
        return () => window.clearTimeout(id)
    }, [value, delayMs])

    return debounced
}

export default useDebouncedValue
