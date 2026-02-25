import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import { useAssignedAuctionsTableColumns } from './AssignedAuctionsTableColumns'
import { HallAuctionItem } from '@/api/types/hall-auctions'
import { useGetHallAuctions } from '@/api/hooks/halls'
import { ServerFilterConfig, useServerTable } from '@/utils/hooks/useServerTable'

export default function AssignedAuctionsTable() {
    const { t } = useTranslation()
    const { id: hallId } = useParams<{ id: string }>()

    const { items, isLoading, isError, errorMessage, total, limit } =
        useGetHallAuctions(hallId ?? '')

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('halls.details.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    { label: t('halls.details.table.status.live'), value: 'LIVE' },
                    { label: t('halls.details.table.status.scheduled'), value: 'SCHEDULED' },
                    { label: t('halls.details.table.status.hidden'), value: 'HIDDEN' },
                    { label: t('halls.details.table.status.ended'), value: 'ENDED' },
                    { label: t('halls.details.table.status.rejected'), value: 'REJECTED' },
                    { label: t('halls.details.table.status.cancelled'), value: 'CANCELLED' },
                ],
                placeholder: t('halls.details.table.filters.allStatus'),
                isSearchable: false,
            },
        ],
        [t],
    )

    const tableQ = useServerTable({
        pageSize: limit,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const columns = useAssignedAuctionsTableColumns()

    return (
        <div>
            <ViewTable<HallAuctionItem>
                showSearch
                columns={columns}
                data={items ?? []}
                total={total ?? 0}
                pageSize={tableQ.pageSize}
                searchPlaceholder={t('halls.details.table.searchPlaceholder')}
                searchValue={tableQ.searchValue}
                filters={tableQ.filters}
                isLoading={isLoading}
                emptyText={t('common.noData')}
                requestedPage={tableQ.requestedPage}
                isError={isError}
                errorText={errorMessage ?? ''}
                onPageChange={tableQ.onPageChange}
                onFilterChange={tableQ.onFilterChange}
                onSearchChange={tableQ.onSearchChange}
                onClearAll={tableQ.clearAll}
                showExportButton={false}
            />
        </div>
    )
}
