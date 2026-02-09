import { useState, useMemo } from 'react'
import { HALLS_ITEMS_MOCK } from '../data/halls.mock'

interface UseGetHallsProps {
    search?: string
    status?: string
    page?: number
    limit?: number
}

export function useGetHalls({
    search,
    status,
    page = 1,
    limit = 10
}: UseGetHallsProps) {
    const [isLoading] = useState(false)

    const filteredData = useMemo(() => {
        let result = [...HALLS_ITEMS_MOCK]

        if (search) {
            const searchLower = search.toLowerCase()
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchLower) ||
                item.code.toLowerCase().includes(searchLower)
            )
        }

        if (status && status !== 'null') {
            result = result.filter(item => item.status === status)
        }

        return result
    }, [search, status])

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
