import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useOrdersTableColumns } from './OrdersTableColumns'
import { Order } from '@/api/types/orders'
import { useGetOrders } from '../hooks/useGetOrders'
import Button from '@/components/ui/Button'
import { HiDownload } from 'react-icons/hi'

export default function OrdersTable() {
    const { t } = useTranslation()

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'type',
                label: t('orders.table.filters.type'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('orders.table.type.liveAuction'),
                        value: 'live_auction',
                    },
                    {
                        label: t('orders.table.type.fixedPrice'),
                        value: 'fixed_price',
                    },
                    {
                        label: t('orders.table.type.durationAuction'),
                        value: 'duration_auction',
                    },
                ],
                placeholder: t('orders.table.filters.allTypes'),
            },
            {
                key: 'orderStatus',
                label: t('orders.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('orders.table.orderStatus.completed'),
                        value: 'completed',
                    },
                    {
                        label: t('orders.table.orderStatus.pending'),
                        value: 'pending',
                    },
                    {
                        label: t('orders.table.orderStatus.confirmed'),
                        value: 'confirmed',
                    },
                    {
                        label: t('orders.table.orderStatus.cancelled'),
                        value: 'cancelled',
                    },
                ],
                placeholder: t('orders.table.filters.allStatus'),
            },
            {
                key: 'paymentStatus',
                label: t('orders.table.filters.paymentStatus'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('orders.table.paymentStatus.paid'),
                        value: 'paid',
                    },
                    {
                        label: t('orders.table.paymentStatus.unpaid'),
                        value: 'unpaid',
                    },
                    {
                        label: t('orders.table.paymentStatus.paymentHeld'),
                        value: 'payment_held',
                    },
                    {
                        label: t('orders.table.paymentStatus.failed'),
                        value: 'failed',
                    },
                ],
                placeholder: t('orders.table.filters.allPaymentStatus'),
            },
        ],
        [t],
    )

    const tableQ = useServerTable({
        pageSize: 10,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const {
        items,
        total,
        isLoading,
        isError,
        errorMessage,
        limit
    } = useGetOrders({
        search: tableQ.searchValue,
        type: tableQ.filters.find(f => f.key === 'type')?.value as string,
        orderStatus: tableQ.filters.find(f => f.key === 'orderStatus')?.value as string,
        paymentStatus: tableQ.filters.find(f => f.key === 'paymentStatus')?.value as string,
        page: tableQ.requestedPage,
        limit: tableQ.pageSize
    })

    const columns = useOrdersTableColumns()

    const handleExport = () => {
        // Placeholder for export functionality
        console.log('Exporting CSV...')
        alert('Exporting CSV... (This is a placeholder)')
    }

    const HeaderActions = () => {
        return (
            <Button
                size="md"
                icon={<HiDownload className="text-primary-500 dark:text-primary-100" />}
                onClick={handleExport}
            >
                {t('viewTable.defaultExportButtonText')}
            </Button>
        )
    }

    return (
        <ViewTable<Order>
            showSearch
            title={t('orders.table.title')}
            columns={columns}
            data={items ?? []}
            total={total ?? 0}
            pageSize={limit}
            searchPlaceholder={t('orders.table.searchPlaceholder')}
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoading}
            emptyText={t('orders.table.emptyText')}
            requestedPage={tableQ.requestedPage}
            isError={isError}
            errorText={errorMessage ?? ''}

            onPageChange={tableQ.onPageChange}
            onFilterChange={tableQ.onFilterChange}
            onSearchChange={tableQ.onSearchChange}
            onClearAll={tableQ.clearAll}
            headerActions={<HeaderActions />}
            showExportButton={false}
        />
    )
}
