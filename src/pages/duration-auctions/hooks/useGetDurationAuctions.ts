import { useState, useMemo } from 'react'
import { DURATION_AUCTIONS_MOCK } from '../data/duration-auctions.mock'

interface UseGetDurationAuctionsProps {
    search?: string
    status?: string
    category?: string
    page?: number
    limit?: number
}

export function useGetDurationAuctions({
    search,
    status,
    category,
    page = 1,
    limit = 10
}: UseGetDurationAuctionsProps) {
    const [isLoading] = useState(false)

    const filteredData = useMemo(() => {
        let result = [...DURATION_AUCTIONS_MOCK]

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
