import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Components
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'

// Hooks
import { ServerFilterConfig, useServerTable } from '@/utils/hooks/useServerTable'
import { useFixedPriceTableColumns } from './FixedPriceTableColumns'
import { useGetAllProducts } from '@/api/hooks/products'
import { useGetAllCategoriesSelect } from '@/api/hooks/categories'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'
import ServerCsvExportButton from '@/components/shared/ServerCsvExportButton'
import ProductsServices from '@/api/services/products'
import { useFixedPriceCsvColumns } from './fixed-price.csv-columns'

// Types
import { Product } from '@/api/types/products'
import { Category } from '@/api/types/categories'

/**
 * FixedPriceTable Component
 * Renders a data table for fixed-price products with filtering, searching, and pagination.
 */
export default function FixedPriceTable() {
    const { t, i18n } = useTranslation()
    const pageLanguage = i18n.language

    // States for category search and debouncing
    const [categorySearch, setCategorySearch] = useState('')
    const debouncedCategorySearch = useDebouncedValue(categorySearch, 400)

    // Fetch products
    const {
        products,
        isLoading,
        total,
        errorMessage,
        isError,
        limit,
    } = useGetAllProducts()

    // Fetch categories for the filter
    const {
        data: categoriesData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isFetching,
    } = useGetAllCategoriesSelect(debouncedCategorySearch)

    // Map categories to filter options
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

    // Table filters configuration
    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'effectiveStatus',
                label: t('fixedPrice.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    { label: t('fixedPrice.table.status.active'), value: 'active' },
                    { label: t('fixedPrice.table.status.rejected'), value: 'rejected' },
                    { label: t('fixedPrice.table.status.hidden'), value: 'hidden' },
                    { label: t('fixedPrice.table.status.outOfStock'), value: 'sold' },
                    { label: t('fixedPrice.table.status.pendingReview'), value: 'pending_approval' },
                    { label: t('fixedPrice.table.status.auctionScheduled'), value: 'auction_scheduled' },
                    { label: t('fixedPrice.table.status.draft'), value: 'draft' },

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
                isSearchable: true,
                onSearch: (v) => setCategorySearch(v),
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

    // Server-side table state management
    const tableQ = useServerTable({
        pageSize: 10,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const columns = useFixedPriceTableColumns()

    const csvColumns = useFixedPriceCsvColumns()

    /**
     * HeaderActions Component
     * Renders the export button and other actions in the table header.
     */
    const HeaderActions = () => {
        return (
            <ServerCsvExportButton
                fileNamePrefix="fixed-price-items"
                columns={csvColumns}
                currentData={products}
                serviceMethod={ProductsServices.getProducts}
            />
        )
    }

    return (
        <ViewTable<Product>
            showSearch
            title={t('fixedPrice.table.title')}
            columns={columns}
            data={products ?? []}
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

