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
    value: CategoryId | CategoryId[] | null
    onChange: (value: CategoryId | CategoryId[] | null) => void
    placeholder?: string
    size?: 'sm' | 'md' | 'lg'
    maxMenuHeight?: number
    isDisabled?: boolean
    menuPortalZ?: number
    classNames?: string
    errorPlaceholder?: string
    /** ID(s) of the pre-selected category in update mode to fetch its details (e.g., parent category) */
    initialId?: CategoryId | CategoryId[] | null
    /** Full category object(s) to skip fetching details if already available */
    initialOption?: Category | Category[] | null
    level?: number
    isMulti?: boolean
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
    isMulti = false,
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

    // Normalize initial IDs to array for easier processing
    const initialIds = useMemo(() => {
        if (!initialId) return []
        return Array.isArray(initialId) ? initialId : [initialId]
    }, [initialId])

    // Normalize initial options to array
    const initialOptions = useMemo(() => {
        if (!initialOption) return []
        return Array.isArray(initialOption) ? initialOption : [initialOption]
    }, [initialOption])

    // Fetch details for any ID that doesn't have an option provided
    // For simplicity, if we have multiple IDs, we might need a bulk fetch hook or handle it individually.
    // However, usually initialId is used for single select. For multi-select, initialOptions is often preferred.
    // If we only have one initialId, we can still use the existing hook.
    const { category: singleInitialCategory, isLoading: isInitialLoading } =
        useGetCategoryById(initialIds.length === 1 && !initialOptions.length ? initialIds[0] : '', {
            enabled: Boolean(initialIds.length === 1 && !initialOptions.length),
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

        // Collect all potential initial categories and unify them
        const initialMap = new Map<CategoryId, Category>()
        initialOptions.forEach(cat => { if (cat) initialMap.set(cat.id, cat) })
        if (singleInitialCategory) {
            initialMap.set(singleInitialCategory.id, singleInitialCategory)
        }

        // Add extra options that are not in fetchedOptions
        const extraOptions: SelectOption<CategoryId>[] = []
        initialMap.forEach((cat, id) => {
            if (!fetchedOptions.some((o) => o.value === id)) {
                const byPageLang = cat.translations?.find(
                    (tr: CategoryTranslation) => tr.languageCode === pageLanguage
                )?.name

                const label = byPageLang || cat.slug
                extraOptions.push({ label, value: id })
            }
        })

        return [...extraOptions, ...fetchedOptions]
    }, [categoriesData, i18n.language, singleInitialCategory, initialOptions])

    const selectedOption = useMemo(() => {
        if (isMulti) {
            const values = Array.isArray(value) ? value : value ? [value] : []
            // Filter categoryOptions to find existing ones, but also handle cases where value might be present 
            // even if not in categoryOptions yet (though extraOptions should cover it)
            return categoryOptions.filter((o) => values.includes(o.value))
        }
        return categoryOptions.find((o) => o.value === value) ?? null
    }, [categoryOptions, value, isMulti])

    const resolvedPlaceholder = useMemo(() => {
        if (!isError) return placeholder

        const apiMessage = getApiErrorMessage(error)
        return apiMessage || errorPlaceholder
    }, [isError, error, placeholder, errorPlaceholder])

    return (
        <Select
            isMulti={isMulti}
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
            onChange={(opt) => {
                if (isMulti) {
                    const selected = (opt || []) as SelectOption<CategoryId>[]
                    onChange(selected.map((o) => o.value))
                } else {
                    const selected = opt as SelectOption<CategoryId> | null
                    onChange(selected?.value ?? null)
                }
            }}
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

