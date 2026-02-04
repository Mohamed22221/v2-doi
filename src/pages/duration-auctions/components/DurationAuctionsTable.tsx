import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useDurationAuctionsTableColumns } from './DurationAuctionsTableColumns'
import { LiveAuctionItem } from '@/api/types/live-auctions'
import { useGetDurationAuctions } from '../hooks/useGetDurationAuctions'
import Button from '@/components/ui/Button'
import { HiDownload } from 'react-icons/hi'
import { useGetAllCategoriesSelect } from '@/api/hooks/categories'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'
import { Category } from '@/api/types/categories'

export default function DurationAuctionsTable() {
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
                label: t('durationAuctions.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    { label: t('durationAuctions.table.status.live'), value: 'live' },
                    { label: t('durationAuctions.table.status.scheduled'), value: 'scheduled' },
                    { label: t('durationAuctions.table.status.hidden'), value: 'hidden' },
                    { label: t('durationAuctions.table.status.ended'), value: 'ended' },
                    { label: t('durationAuctions.table.status.rejected'), value: 'rejected' },
                ],
                placeholder: t('durationAuctions.table.filters.allStatus'),
            },
            {
                key: 'categoryId',
                label: t('durationAuctions.table.filters.category'),
                value: null,
                valueType: 'string',
                options: categoryOptions,
                placeholder: t('durationAuctions.table.filters.allCategory'),
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
    } = useGetDurationAuctions({
        search: tableQ.searchValue,
        status: tableQ.filters.find(f => f.key === 'status')?.value as string,
        category: tableQ.filters.find(f => f.key === 'categoryId')?.value as string,
        page: tableQ.requestedPage,
        limit: tableQ.pageSize
    })

    const columns = useDurationAuctionsTableColumns()

    const handleExport = () => {
        console.log('Exporting CSV...')
    }

    const HeaderActions = () => {
        return (
            <Button
                size="md"
                icon={<HiDownload className="text-primary-500 dark:text-primary-100" />}
                onClick={handleExport}
            >
                {t('common.exportCsv') || 'Export CSV'}
            </Button>
        )
    }

    return (
        <ViewTable<LiveAuctionItem>
            showSearch
            title={t('durationAuctions.table.title') || 'Duration Auctions'}
            columns={columns}
            data={items ?? []}
            total={total ?? 0}
            pageSize={limit}
            searchPlaceholder={t('durationAuctions.table.searchPlaceholder')}
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
