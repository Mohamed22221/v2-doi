import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useSellerTableColumns } from './SellerTableColumns'
import { UserItem } from '@/api/types/users'
import { useGetSellers } from '../hooks/useGetSellers'
import ServerCsvExportButton from '@/components/shared/ServerCsvExportButton'
import { useSellerCsvColumns } from './sellers.csv-columns'

export default function SellerTable() {
    const { t } = useTranslation()

    const columns = useSellerTableColumns()

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('users.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    { label: t('fixedPrice.sellers.status.approved'), value: 'approved' },
                    { label: t('fixedPrice.sellers.status.rejected'), value: 'rejected' },
                    { label: t('fixedPrice.sellers.status.pending'), value: 'pending' },
                ],
                placeholder: t('users.table.filters.allStatus'),
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
        users,
        isLoading,
        total,
        isError,
        errorMessage,
        limit,
    } = useGetSellers({
        search: tableQ.searchValue,
        isActive: undefined, // No longer using isActive boolean
        status: tableQ.filters.find(f => f.key === 'status')?.value as any,
        page: tableQ.requestedPage,
        limit: tableQ.pageSize
    } as any)

    const csvColumns = useSellerCsvColumns()

    const HeaderActions = () => {
        return (
            <ServerCsvExportButton
                fileNamePrefix="sellers"
                columns={csvColumns}
                currentData={users}
                serviceMethod={async () => ({ data: { items: users, total, page: 1, limit, totalPages: 1 } })}
            />
        )
    }

    return (
        <ViewTable<UserItem>
            showSearch
            title={t('fixedPrice.sellers.title')}
            columns={columns}
            data={users ?? []}
            total={total ?? 0}
            pageSize={tableQ.pageSize}
            searchPlaceholder={t('users.table.searchPlaceholder')}
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoading}
            emptyText={t('users.table.emptyText')}
            avatarInColumns={[0]}
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
