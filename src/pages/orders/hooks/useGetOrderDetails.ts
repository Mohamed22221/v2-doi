import { useState, useEffect } from 'react'
import { getOrderDetailsById } from '../data/orders.mock'
import { OrderDetails } from '@/api/types/orders'

export function useGetOrderDetails(id: string) {
    const [data, setData] = useState<OrderDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const details = getOrderDetailsById(id)
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
        error: isError ? { message: 'orders.errors.orderNotFound' } : null
    }
}
