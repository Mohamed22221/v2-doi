import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useFixedPriceTableColumns } from './FixedPriceTableColumns'
import { FixedPriceItem } from '@/api/types/fixed-price'
import { useGetFixedPriceItems } from '../hooks/useGetFixedPriceItems'
import Button from '@/components/ui/Button'
import { HiDownload } from 'react-icons/hi'

import { useGetAllCategoriesSelect } from '@/api/hooks/categories'
import { Category } from '@/api/types/categories'

export default function FixedPriceTable() {
    const { t, i18n } = useTranslation()
    const pageLanguage = i18n.language

    const {
        data: categoriesData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading: isLoadingCategories,
        isError: isCategoriesError,
        isFetching,
    } = useGetAllCategoriesSelect()

    const categoryOptions = useMemo(() => {
        return (
            categoriesData?.items?.map((cat: Category) => {
                const byPageLang = cat.translations.find(
                    (t) =>
                        t.languageCode.toLowerCase() ===
                        pageLanguage.toLowerCase(),
                )?.name

                const label = byPageLang || cat.slug

                return {
                    label,
                    value: cat.id,
                }
            }) ?? []
        )
    }, [categoriesData, pageLanguage])

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('fixedPrice.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('fixedPrice.table.status.active'),
                        value: 'active',
                    },
                    {
                        label: t('fixedPrice.table.status.rejected'),
                        value: 'rejected',
                    },
                    {
                        label: t('fixedPrice.table.status.hidden'),
                        value: 'hidden',
                    },
                    {
                        label: t('fixedPrice.table.status.outOfStock'),
                        value: 'out_of_stock',
                    },
                    {
                        label: t('fixedPrice.table.status.pendingReview'),
                        value: 'pending_review',
                    },
                ],
                placeholder: t('fixedPrice.table.filters.allStatus'),
            },
            {
                key: 'categoryId',
                label: t('brands.table.filters.category'),
                value: null,
                valueType: 'string',
                options: categoryOptions,
                placeholder: t('brands.table.filters.allCategories'),
                infinity: {
                    fetchNextPage,
                    hasNextPage,
                    isFetchingNextPage,
                    isFetching,
                },
            },
        ],
        [
            t,
            categoryOptions,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isFetching,
        ],
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
    } = useGetFixedPriceItems({
        search: tableQ.searchValue,
        status: tableQ.filters.find(f => f.key === 'status')?.value as string,
        categoryId: tableQ.filters.find(f => f.key === 'categoryId')?.value as string,
        page: tableQ.requestedPage,
        limit: tableQ.pageSize
    })

    const columns = useFixedPriceTableColumns()

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
        <ViewTable<FixedPriceItem>
            showSearch
            title={t('fixedPrice.table.title')}
            columns={columns}
            data={items ?? []}
            total={total ?? 0}
            pageSize={limit}
            searchPlaceholder={t('fixedPrice.table.searchPlaceholder')}
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoading}
            emptyText={t('fixedPrice.table.emptyText')}
            avatarInColumns={[0, 2]}
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
