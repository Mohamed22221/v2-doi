import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useHallsTableColumns } from './HallsTableColumns'
import { HallItem } from '@/api/types/halls'
import Button from '@/components/ui/Button'
import { HiPlus } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import { useGetAllHalls } from '@/api/hooks/halls'
import ServerCsvExportButton from '@/components/shared/ServerCsvExportButton'
import HallsServices from '@/api/services/halls'
import { useHallsCsvColumns } from './halls.csv-columns'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'
import { useGetAllCategoriesSelect } from '@/api/hooks/categories'
import { useGetAllRegionsSelect } from '@/api/hooks/regions'
import { Category } from '@/api/types/categories'

export default function HallsTable() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const {
        items,
        total,
        isLoading,
        isError,
        errorMessage,
        limit,
    } = useGetAllHalls()

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
                const byPageLang = cat.translations?.[0]?.name

                const label = byPageLang || cat.slug

                return {
                    label,
                    value: cat.id,
                }
            }) ?? []
        )
    }, [categoriesData])

    const [regionSearch, setRegionSearch] = useState('')
    const debouncedRegionSearch = useDebouncedValue(regionSearch, 500)

    const {
        data: regionsData,
        fetchNextPage: fetchNextPageRegions,
        hasNextPage: hasNextPageRegions,
        isFetchingNextPage: isFetchingNextPageRegions,
        isFetching: isFetchingRegions,
    } = useGetAllRegionsSelect(debouncedRegionSearch)

    const regionOptions = useMemo(() => {
        return (
            regionsData?.items?.map((r) => ({
                label: i18n.language === 'ar' ? r?.nameAr : r?.name,
                value: r?.id,
            })) || []
        )
    }, [regionsData, i18n.language])

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'visibilityStatus',
                label: t('halls.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('halls.table.status.active'),
                        value: 'ACTIVE',
                    },
                    {
                        label: t('halls.table.status.archieved'),
                        value: 'ARCHIVED',
                    },
                    {
                        label: t('halls.table.status.hidden'),
                        value: 'HIDDEN',
                    },
                ],
                placeholder: t('halls.table.filters.allStatus'),
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
            {
                key: 'regionId',
                label: t('locations.cities.table.columns.region'),
                value: null,
                valueType: 'string',
                options: regionOptions,
                placeholder: t('locations.cities.modal.fields.regionPlaceholder'),
                infinity: {
                    fetchNextPage: fetchNextPageRegions,
                    hasNextPage: hasNextPageRegions,
                    isFetchingNextPage: isFetchingNextPageRegions,
                    isFetching: isFetchingRegions,
                },
                isSearchable: true,
                onSearch: (v) => setRegionSearch(v),
            },
            // {
            //     key: 'dateRange',
            //     label: t('halls.table.filters.dateRange'),
            //     value: null,
            //     type: 'date',
            //     options: [],
            //     placeholder: t('halls.table.filters.today'),
            // },
        ],
        [t, categoryOptions,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isFetching,
            regionOptions,
            fetchNextPageRegions,
            hasNextPageRegions,
            isFetchingNextPageRegions,
            isFetchingRegions],
    )

    const tableQ = useServerTable({
        pageSize: 10,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const columns = useHallsTableColumns()
    const csvColumns = useHallsCsvColumns()

    const HeaderActions = () => {
        return (
            <div className="flex items-center gap-2">
                <ServerCsvExportButton
                    fileNamePrefix="halls"
                    columns={csvColumns}
                    currentData={items}
                    serviceMethod={HallsServices.getHalls}
                />
                <Button
                    size="sm md:md"
                    variant="solid"
                    icon={<HiPlus />}
                    onClick={() => navigate('/halls/create')}
                >
                    {t('halls.table.actions.createHall')}
                </Button>
            </div>
        )
    }

    return (
        <ViewTable<HallItem>
            showSearch
            title={t('halls.table.title')}
            columns={columns}
            data={items ?? []}
            total={total ?? 0}
            pageSize={limit}
            searchPlaceholder={t('halls.table.searchPlaceholder')}
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoading}
            emptyText={t('halls.table.emptyText')}
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
