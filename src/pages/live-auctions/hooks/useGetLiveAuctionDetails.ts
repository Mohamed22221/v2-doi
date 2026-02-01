import { useState, useEffect } from 'react'
import { getLiveAuctionDetailsById } from '../data/live-auctions.mock'
import { LiveAuctionItemDetails } from '@/api/types/live-auctions'

export function useGetLiveAuctionDetails(id: string) {
    const [data, setData] = useState<LiveAuctionItemDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const details = getLiveAuctionDetailsById(id)
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
        error: isError ? { message: 'liveAuctions.errors.itemNotFound' } : null
    }
}
