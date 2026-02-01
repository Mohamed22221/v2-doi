import { useState, useMemo } from 'react'
import { LIVE_AUCTIONS_MOCK } from '../data/live-auctions.mock'

interface UseGetLiveAuctionsProps {
    search?: string
    status?: string
    category?: string
    page?: number
    limit?: number
}

export function useGetLiveAuctions({
    search,
    status,
    category,
    page = 1,
    limit = 10
}: UseGetLiveAuctionsProps) {
    // Simulate loading state as in fixed-price
    const [isLoading] = useState(false)

    const filteredData = useMemo(() => {
        let result = [...LIVE_AUCTIONS_MOCK]

        if (search) {
            const searchLower = search.toLowerCase()
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchLower) ||
                item.id.toLowerCase().includes(searchLower) ||
                item.seller.toLowerCase().includes(searchLower)
            )
        }

        if (status && status !== 'null') {
            result = result.filter(item => item.status === status)
        }

        // Category filter logic using categoryId
        if (category && category !== 'null') {
            result = result.filter(item =>
                (item as any).categoryId === category
            )
        }

        return result
    }, [search, status, category])

    const total = filteredData.length

    const paginatedData = useMemo(() => {
        const start = (page - 1) * limit
        return filteredData.slice(start, start + limit)
    }, [filteredData, page, limit])

    return {
        items: paginatedData,
        total,
        isLoading,
        isError: false,
        errorMessage: '',
        limit
    }
}
