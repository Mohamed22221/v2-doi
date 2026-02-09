import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// UI Components
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'

// Shared Components
import ServerCsvExportButton from '@/components/shared/ServerCsvExportButton'

// Hooks
import { useGetSellers } from '@/api/hooks/sellers'
import { useSellerTableColumns } from './SellerTableColumns'
import { useSellerCsvColumns } from './sellers.csv-columns'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'

// Types
import { SellerItem } from '@/api/types/sellers'

/**
 * Seller Table Component
 * Displays a list of sellers with search, filtering, and CSV export functionality
 */
export default function SellerTable() {
    const { t } = useTranslation()

    // Table Columns Configuration
    const columns = useSellerTableColumns()

    // Server-side Filtering Configuration
    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'approvalStatus',
                label: t('sellers.table.filters.approvalStatus'),
                value: null,
                valueType: 'string',
                options: [
                    { label: t('sellers.table.status.pending'), value: 'pending' },
                    { label: t('sellers.table.status.approved'), value: 'approved' },
                    { label: t('sellers.table.status.rejected'), value: 'rejected' },
                ],
                placeholder: t('sellers.table.filters.allStatus'),
            },
            {
                key: 'isDeleted',
                label: t('sellers.table.filters.isDeleted'),
                value: null,
                valueType: 'boolean',
                options: [
                    { label: t('sellers.table.status.isDeleted'), value: true },
                    { label: t('sellers.table.status.nonDeleted'), value: false },
                ],
                placeholder: t('sellers.table.filters.allStatus'),
            },
        ],
        [t],
    )

    // Table State Management
    const tableQ = useServerTable({
        pageSize: 10,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    // Data Fetching
    const {
        sellers: rawSellers,
        isLoading,
        total,
        isError,
        errorMessage,
        limit,
    } = useGetSellers()

    // Data Processing (ensure user exists)
    const sellers = useMemo(() => rawSellers?.filter(s => !!s.user) ?? [], [rawSellers])

    // CSV Export Configuration
    const csvColumns = useSellerCsvColumns()

    const HeaderActions = () => {
        return (
            <ServerCsvExportButton
                fileNamePrefix="sellers"
                columns={csvColumns}
                currentData={sellers}
                serviceMethod={async () => ({ data: { items: sellers, total, page: 1, limit, totalPages: 1 } })}
            />
        )
    }

    return (
        <ViewTable<SellerItem>
            showSearch
            title={t('sellers.table.title')}
            columns={columns}
            data={sellers ?? []}
            total={total ?? 0}
            pageSize={tableQ.pageSize}
            searchPlaceholder={t('sellers.table.searchPlaceholder')}
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoading}
            emptyText={t('sellers.table.emptyText')}
            avatarInColumns={[0]}
            requestedPage={tableQ.requestedPage}
            isError={isError}
            errorText={errorMessage ?? ''}
            headerActions={<HeaderActions />}
            showExportButton={false}
            // Callbacks (placed at the end to satisfy linting rules)
            onPageChange={tableQ.onPageChange}
            onFilterChange={tableQ.onFilterChange}
            onSearchChange={tableQ.onSearchChange}
            onClearAll={tableQ.clearAll}
        />
    )
}
