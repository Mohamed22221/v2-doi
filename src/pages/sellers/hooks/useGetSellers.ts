import { useState, useMemo } from 'react'
import { SELLERS_MOCK } from '../data/sellers.mock'
import { UserItem } from '@/api/types/users'

interface UseGetSellersProps {
    search?: string
    status?: 'approved' | 'rejected' | 'pending'
    page?: number
    limit?: number
}

export function useGetSellers({
    search,
    status,
    page = 1,
    limit = 10
}: UseGetSellersProps = {}) {
    const [isLoading] = useState(false)

    const filteredData = useMemo(() => {
        let result = [...SELLERS_MOCK]

        if (search) {
            const searchLower = search.toLowerCase()
            result = result.filter(item =>
                item.firstName.toLowerCase().includes(searchLower) ||
                item.lastName.toLowerCase().includes(searchLower) ||
                item.email.toLowerCase().includes(searchLower) ||
                item.id.toLowerCase().includes(searchLower) ||
                item.phone.toLowerCase().includes(searchLower)
            )
        }

        if (status && status !== null) {
            result = result.filter(item => (item as any).status === status)
        }

        return result
    }, [search, status])

    const total = filteredData.length

    const paginatedData = useMemo(() => {
        const start = (page - 1) * limit
        return filteredData.slice(start, start + limit)
    }, [filteredData, page, limit])

    return {
        users: paginatedData,
        total,
        isLoading,
        isError: false,
        errorMessage: '',
        limit
    }
}
