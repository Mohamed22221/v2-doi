import { useState, useEffect } from 'react'
import { getFixedPriceDetailsById } from '../data/fixedPrice.mock'
import { FixedPriceItemDetails } from '@/api/types/fixed-price'

export function useGetFixedPriceDetails(id: string) {
    const [data, setData] = useState<FixedPriceItemDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const details = getFixedPriceDetailsById(id)
            if (details) {
                setData(details)
                setIsError(false)
            } else {
                setIsError(true)
            }
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [id])

    return {
        data: data ? { data } : null,
        isLoading,
        isError,
        error: isError ? { message: 'Item not found' } : null
    }
}
