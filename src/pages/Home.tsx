import { useEffect, useMemo, useState } from 'react'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

type Item = {
    id: string
    name: string
    seller: string
    status: string
    category: string
}
export default function Home() {
    const initialFilters: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: 'Status',
                value: '',
                options: [
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                ],
                placeholder: 'All Status',
            },
            {
                key: 'category',
                label: 'Category',
                value: '',
                options: [
                    { label: 'Electronics', value: 'electronics' },
                    { label: 'Fashion', value: 'fashion' },
                    { label: 'Home', value: 'home' },
                ],
                placeholder: 'All Category',
            },
        ],
        [],
    )

    const tableQ = useServerTable({
        pageSize: 10,
        initialFilters,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const MOCK_ITEMS: Item[] = [
        {
            id: '1',
            name: 'iPhone 14',
            seller: 'Apple Store',
            status: 'active',
            category: 'electronics',
        },
        {
            id: '2',
            name: 'T-Shirt',
            seller: 'Zara',
            status: 'inactive',
            category: 'fashion',
        },
        {
            id: '3',
            name: 'Microwave',
            seller: 'LG',
            status: 'active',
            category: 'home',
        },
        {
            id: '4',
            name: 'Headphones',
            seller: 'Sony',
            status: 'active',
            category: 'electronics',
        },
    ]
    const [itemsData] = useState<Item[]>(MOCK_ITEMS)
    const [total] = useState(MOCK_ITEMS.length)
    const [, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let cancelled = false

        async function load() {
            setLoading(true)
            setError(null)
            try {
                // call API using tableQ.params
                // const res = await api.get('/items', { params: tableQ.params })

                if (cancelled) return
                // setItemsData(res.data.data)
                // setTotal(res.data.total)
            } catch (e) {
                if (cancelled) return
                setError('Backend error message here')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [tableQ.params])
    const columns = useMemo(() => {
        return [
            {
                header: 'ID',
                accessorKey: 'id',
            },
            {
                header: 'Name',
                accessorKey: 'name',
            },
            {
                header: 'Seller',
                accessorKey: 'seller',
            },
            {
                header: 'Status',
                accessorKey: 'status',
            },
            {
                header: 'Category',
                accessorKey: 'category',
            },
        ]
    }, [])

    return (
        <BackgroundRounded>
            <ViewTable<Item>
                showSearch
                title="Home Data"
                columns={columns}
                data={itemsData}
                total={total}
                currentPage={tableQ.currentPage}
                pageSize={tableQ.pageSize}
                searchPlaceholder="Search by item name, item ID, or seller"
                searchValue={tableQ.searchValue}
                filters={tableQ.filters}
                isLoading={loading}
                emptyText="No items match your filters."
                onClearAll={tableQ.clearAll}
                onSearchChange={tableQ.onSearchChange}
                onFilterChange={tableQ.onFilterChange}
                onPageChange={tableQ.setCurrentPage}
                // isError={true}
            />
            
        </BackgroundRounded>
    )
}
