import { useState, useEffect } from 'react'
import { getSellerById } from '../data/sellers.mock'

export function useGetSellerDetails(id: string) {
    const [data, setData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState<{ message: string } | null>(null)

    useEffect(() => {
        setIsLoading(true)
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const details = getSellerById(id)
            if (details) {
                setData(details)
                setIsError(false)
                setError(null)
            } else {
                setIsError(true)
                setError({ message: 'Seller not found' })
            }
            setIsLoading(false)
        }, 500)

        return () => clearTimeout(timer)
    }, [id])

    return {
        data,
        isLoading,
        isError,
        error
    }
}
