import { useState, useMemo } from 'react'
import { FIXED_PRICE_ITEMS_MOCK } from '../data/fixedPrice.mock'
import { FixedPriceItem } from '@/api/types/fixed-price'

interface UseGetFixedPriceItemsProps {
    search?: string
    status?: string
    categoryId?: string
    page?: number
    limit?: number
}

export function useGetFixedPriceItems({
    search,
    status,
    categoryId,
    page = 1,
    limit = 10
}: UseGetFixedPriceItemsProps) {
    // In a real app, this would be a useQuery hook
    const [isLoading] = useState(false)

    const filteredData = useMemo(() => {
        let result = [...FIXED_PRICE_ITEMS_MOCK]

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

        if (categoryId && categoryId !== 'null') {
            // Since this is mock data and categoryId is from API, 
            // for demonstration we search by seller or name if it matches "fake" IDs 
            // or just keep it for UI demonstration.
            // In a real app, you'd filter by categoryId field.
            console.log('Filtering by categoryId:', categoryId)
        }

        return result
    }, [search, status, categoryId])

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
