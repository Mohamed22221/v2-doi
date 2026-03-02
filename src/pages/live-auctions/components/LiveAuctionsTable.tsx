import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useLiveAuctionsTableColumns } from './LiveAuctionsTableColumns'
import { useGetHallItems } from '@/api/hooks/halls'
import { useGetAllCategoriesSelect } from '@/api/hooks/categories'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'
import { Category } from '@/api/types/categories'
import { HallItem } from '@/api/types/hall-auctions'
import ServerCsvExportButton from '@/components/shared/ServerCsvExportButton'
import HallsServices from '@/api/services/halls'
import { useLiveAuctionsCsvColumns } from './live-auctions.csv-columns'

export default function LiveAuctionsTable() {
    const { t } = useTranslation()

    const [categorySearch, setCategorySearch] = useState('')
    const debouncedCategorySearch = useDebouncedValue(categorySearch, 400)

    const {
        data: categoriesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
    } = useGetAllCategoriesSelect(debouncedCategorySearch)

    const categoryOptions = useMemo(() => {
        return (
            categoriesData?.items?.map((cat: Category) => {
                const name = cat.translations?.[0]?.name
                const label = name || cat.slug

                return {
                    label,
                    value: cat.id,
                }
            }) ?? []
        )
    }, [categoriesData])

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('liveAuctions.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    { label: t('halls.table.status.active'), value: 'ACTIVE' },
                    { label: t('halls.table.status.scheduled'), value: 'SCHEDULED' },
                    { label: t('halls.table.status.hidden'), value: 'HIDDEN' },
                    { label: t('halls.table.status.ended'), value: 'ENDED' },
                    { label: t('halls.table.status.rejected'), value: 'REJECTED' },
                    { label: t('halls.table.status.cancelled'), value: 'CANCELLED' },
                    { label: t('halls.table.status.draft'), value: 'DRAFT' },
                    { label: t('halls.table.status.archived'), value: 'ARCHIVED' },
                    { label: t('halls.table.status.settled'), value: 'SETTLED' },

                ],
                placeholder: t('liveAuctions.table.filters.allStatus'),
            },
            {
                key: 'categoryId',
                label: t('liveAuctions.table.filters.category'),
                value: null,
                valueType: 'string',
                options: categoryOptions,
                placeholder: t('liveAuctions.table.filters.allCategory'),
                infinity: {
                    fetchNextPage,
                    hasNextPage,
                    isFetchingNextPage,
                    isFetching,
                },
                isSearchable: true,
                onSearch: (v) => setCategorySearch(v),
            },
        ],
        [t, categoryOptions, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching],
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
    } = useGetHallItems()

    const columns = useLiveAuctionsTableColumns()
    const csvColumns = useLiveAuctionsCsvColumns()

    const HeaderActions = () => {
        return (
            <ServerCsvExportButton
                fileNamePrefix="live-auctions"
                columns={csvColumns}
                currentData={items}
                serviceMethod={HallsServices.getHallItems}
            />
        )
    }

    return (
        <ViewTable<HallItem>
            showSearch
            title={t('liveAuctions.table.title') || 'Live Auctions'}
            columns={columns}
            data={items ?? []}
            total={total ?? 0}
            pageSize={limit}
            searchPlaceholder={t('liveAuctions.table.searchPlaceholder')}
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
            headerActions={<HeaderActions />}
            showExportButton={false}
        />
    )
}
