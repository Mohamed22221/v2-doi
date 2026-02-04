import { useState, useEffect } from 'react'
import { DisputeItemDetails } from '@/api/types/disputes'
import { getDisputeDetailsById } from '../data/disputes.mock'

export function useGetDisputeDetails(id: string) {
    const [data, setData] = useState<DisputeItemDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setIsError(false)

        // Simulate API call
        setTimeout(() => {
            const dispute = getDisputeDetailsById(id)
            if (dispute) {
                setData(dispute)
            } else {
                setIsError(true)
            }
            setIsLoading(false)
        }, 300)
    }, [id])

    return {
        data,
        isLoading,
        isError,
        errorMessage: isError ? 'Dispute not found' : ''
    }
}
