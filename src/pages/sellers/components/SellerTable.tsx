import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useSellerTableColumns } from './SellerTableColumns'
import { SellerItem } from '@/api/types/sellers'
import { useGetSellers } from '@/api/hooks/sellers'
import ServerCsvExportButton from '@/components/shared/ServerCsvExportButton'
import { useSellerCsvColumns } from './sellers.csv-columns'

export default function SellerTable() {
    const { t } = useTranslation()

    const columns = useSellerTableColumns()

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'isVerified',
                label: t('users.table.filters.status'),
                value: null,
                valueType: 'boolean',
                options: [
                    { label: t('fixedPrice.sellers.status.approved'), value: true },
                    { label: t('fixedPrice.sellers.status.pending'), value: false },
                    { label: t('fixedPrice.sellers.status.rejected'), value: false },
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
        sellers: rawSellers,
        isLoading,
        total,
        isError,
        errorMessage,
        limit,
    } = useGetSellers()

    const sellers = useMemo(() => rawSellers?.filter(s => !!s.user) ?? [], [rawSellers])

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
            title={t('fixedPrice.sellers.title')}
            columns={columns}
            data={sellers ?? []}
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
