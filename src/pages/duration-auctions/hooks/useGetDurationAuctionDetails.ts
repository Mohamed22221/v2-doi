import { useState, useEffect } from 'react'
import { getDurationAuctionDetailsById } from '../data/duration-auctions.mock'
import { LiveAuctionItemDetails } from '@/api/types/live-auctions'

export function useGetDurationAuctionDetails(id: string) {
    const [data, setData] = useState<LiveAuctionItemDetails | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        const timer = setTimeout(() => {
            const details = getDurationAuctionDetailsById(id)
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
        error: isError ? { message: 'durationAuctions.errors.itemNotFound' } : null
    }
}
