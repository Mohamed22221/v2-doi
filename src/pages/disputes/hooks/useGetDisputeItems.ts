import { useState, useMemo } from 'react'
import { DISPUTES_ITEMS_MOCK } from '../data/disputes.mock'
import { DisputeItem } from '@/api/types/disputes'

interface UseGetDisputeItemsProps {
    search?: string
    status?: string
    openedDate?: Date | null
    page?: number
    limit?: number
}

export function useGetDisputeItems({
    search,
    status,
    openedDate,
    page = 1,
    limit = 10
}: UseGetDisputeItemsProps) {
    // In a real app, this would be a useQuery hook
    const [isLoading] = useState(false)

    const filteredData = useMemo(() => {
        let result = [...DISPUTES_ITEMS_MOCK]

        if (search) {
            const searchLower = search.toLowerCase()
            result = result.filter(item =>
                item.id.toLowerCase().includes(searchLower) ||
                item.orderId.toLowerCase().includes(searchLower) ||
                item.buyer.name.toLowerCase().includes(searchLower) ||
                item.seller.toLowerCase().includes(searchLower)
            )
        }

        if (status && status !== 'null') {
            result = result.filter(item => item.status === status)
        }

        if (openedDate) {
            // Filter by date - compare only the date part (ignore time)
            const filterDate = new Date(openedDate)
            filterDate.setHours(0, 0, 0, 0)

            result = result.filter(item => {
                const itemDate = new Date(item.openedAt)
                itemDate.setHours(0, 0, 0, 0)
                return itemDate.getTime() === filterDate.getTime()
            })
        }

        return result
    }, [search, status, openedDate])

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
