import { useState, useMemo } from 'react'
import { ORDERS_MOCK } from '../data/orders.mock'
import { Order } from '@/api/types/orders'

interface UseGetOrdersProps {
    search?: string
    type?: string
    orderStatus?: string
    paymentStatus?: string
    page?: number
    limit?: number
}

export function useGetOrders({
    search,
    type,
    orderStatus,
    paymentStatus,
    page = 1,
    limit = 10
}: UseGetOrdersProps) {
    // In a real app, this would be a useQuery hook
    const [isLoading] = useState(false)

    const filteredData = useMemo(() => {
        let result = [...ORDERS_MOCK]

        if (search) {
            const searchLower = search.toLowerCase()
            result = result.filter(order =>
                order.id.toLowerCase().includes(searchLower) ||
                order.buyer.toLowerCase().includes(searchLower) ||
                order.seller.toLowerCase().includes(searchLower)
            )
        }

        if (type && type !== 'null') {
            result = result.filter(order => order.type === type)
        }

        if (orderStatus && orderStatus !== 'null') {
            result = result.filter(order => order.orderStatus === orderStatus)
        }

        if (paymentStatus && paymentStatus !== 'null') {
            result = result.filter(order => order.paymentStatus === paymentStatus)
        }

        return result
    }, [search, type, orderStatus, paymentStatus])

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
