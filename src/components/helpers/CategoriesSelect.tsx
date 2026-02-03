import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui'
import {
    useGetAllCategoriesSelect,
    useGetCategoryById,
} from '@/api/hooks/categories'
import type { Category, CategoryTranslation } from '@/api/types/categories'
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
    /** ID of the pre-selected category in update mode to fetch its details (e.g., parent category) */
    initialId?: CategoryId | null
    /** Full category object to skip fetching details if already available */
    initialOption?: Category["parent"] | null
    level?: number
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
    initialId,
    initialOption,
    level,
}: CategorySelectProps) {
    const { t, i18n } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 400)

    const {
        data: categoriesData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading: isListLoading,
        isError,
        error,
    } = useGetAllCategoriesSelect(debouncedSearchQuery, level)

    const { category: initialCategory, isLoading: isInitialLoading } =
        useGetCategoryById(initialId as string, {
            enabled: Boolean(initialId && !initialOption),
        })

    const isLoading = isListLoading || isInitialLoading

    const pageLanguage = i18n.language

    const categoryOptions = useMemo<SelectOption<CategoryId>[]>(() => {
        const fetchedOptions =
            categoriesData?.items?.map((cat: Category) => {
                const byPageLang = cat.translations?.find(
                    (tr: CategoryTranslation) => tr.languageCode === pageLanguage
                )?.name

                const label = byPageLang || cat.slug

                return {
                    label,
                    value: cat.id,
                }
            }) ?? []

        // Prioritize initialOption if provided, otherwise fallback to fetched initialCategory
        const selectedCategory = initialOption || initialCategory

        if (
            selectedCategory &&
            !fetchedOptions.some((o: any) => o.value === selectedCategory.id)
        ) {
            const byPageLang = selectedCategory.translations?.find(
                (tr: CategoryTranslation) => tr.languageCode === pageLanguage
            )?.name

            const label = byPageLang || selectedCategory.slug

            return [{ label, value: selectedCategory.id }, ...fetchedOptions]
        }

        return fetchedOptions
    }, [categoriesData, i18n.language, initialCategory, initialOption])

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

