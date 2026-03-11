import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ServerFilterConfig } from '@/utils/hooks/useServerTable'
import { useGetAllCategoriesSelect } from '@/api/hooks/categories'
import { Category } from '@/api/types/categories'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'

export function useAssignedAuctionsTableFilters() {
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
                const byPageLang = cat.translations?.[0]?.name
                const label = byPageLang || cat.slug

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
                label: t('halls.details.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('halls.details.table.status.live'),
                        value: 'ACTIVE',
                    },
                    {
                        label: t('halls.details.table.status.scheduled'),
                        value: 'SCHEDULED',
                    },
                    {
                        label: t('halls.details.table.status.hidden'),
                        value: 'HIDDEN',
                    },
                    {
                        label: t('halls.details.table.status.ended'),
                        value: 'ENDED',
                    },
                    {
                        label: t('halls.details.table.status.rejected'),
                        value: 'REJECTED',
                    },
                    {
                        label: t('halls.details.table.status.cancelled'),
                        value: 'CANCELLED',
                    },
                ],
                placeholder: t('halls.details.table.filters.allStatus'),
                isSearchable: false,
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

    return filtersConfig
}
