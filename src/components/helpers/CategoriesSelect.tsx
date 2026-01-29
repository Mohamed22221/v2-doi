import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui'
import { useGetAllCategoriesSelect } from '@/api/hooks/categories'
import type { Category } from '@/api/types/categories'
import { getApiErrorMessage } from '@/api/error'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'

type SelectOption<TValue extends string = string> = {
    value: TValue
    label: string
}

type CategoryId = Category['id']

type CategorySelectProps = {
    value: CategoryId | null
    onChange: (value: CategoryId | null) => void
    placeholder?: string
    size?: 'sm' | 'md' | 'lg'
    maxMenuHeight?: number
    isDisabled?: boolean
    menuPortalZ?: number
    classNames?: string
    errorPlaceholder?: string
    /** Pre-selected option for update mode (e.g., parent category from details) */
    initialOption?: { value: CategoryId; label: string } | null
}

function CategorySelect({
    value,
    onChange,
    placeholder,
    size = 'sm',
    maxMenuHeight = 300,
    isDisabled = false,
    classNames,
    errorPlaceholder,
    menuPortalZ,
    initialOption,
}: CategorySelectProps) {
    const { t, i18n } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 400)

    const {
        data: categoriesData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useGetAllCategoriesSelect(debouncedSearchQuery)

    const pageLanguage = i18n.language

    const categoryOptions = useMemo<SelectOption<CategoryId>[]>(() => {
        const fetchedOptions =
            categoriesData?.items?.map((cat: Category) => {
                const byPageLang = cat.translations?.[0]?.name

                const label = byPageLang || cat.slug

                return {
                    label,
                    value: cat.id,
                }
            }) ?? []

        // If we have an initialOption, ensure it's in the list
        if (initialOption && !fetchedOptions.some((o) => o.value === initialOption.value)) {
            return [initialOption, ...fetchedOptions]
        }

        return fetchedOptions
    }, [categoriesData, pageLanguage, initialOption])

    const selectedOption = useMemo<SelectOption<CategoryId> | null>(() => {
        return categoryOptions.find((o) => o.value === value) ?? null
    }, [categoryOptions, value])

    const resolvedPlaceholder = useMemo(() => {
        if (!isError) return placeholder

        const apiMessage = getApiErrorMessage(error)
        return apiMessage || errorPlaceholder
    }, [isError, error, placeholder, errorPlaceholder])

    return (
        <Select
            menuPortalZ={menuPortalZ}
            className={classNames}
            size={size}
            maxMenuHeight={maxMenuHeight}
            placeholder={resolvedPlaceholder}
            options={categoryOptions}
            value={selectedOption}
            hasMore={hasNextPage}
            isLoadingMore={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            onChange={(opt) => onChange(opt?.value ?? null)}
            isLoading={isLoading}
            isDisabled={isDisabled}
            loadMoreLabel={t('viewTable.filters.loadMore')}
            isClearable
            isSearchable
            onInputChange={(val) => setSearchQuery(val)}
        />
    )
}

export default CategorySelect

