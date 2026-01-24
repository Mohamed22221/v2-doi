import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui'
import { useGetAllCategoriesSelect } from '@/api/hooks/categories'
import type { Category } from '@/api/types/categories'
import { getApiErrorMessage } from '@/api/error'

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
    fallbackLanguage?: string
    classNames?: string
    errorPlaceholder?: string
}

function CategorySelect({
    value,
    onChange,
    placeholder = 'Select category',
    size = 'sm',
    maxMenuHeight = 300,
    isDisabled = false,
    fallbackLanguage = 'en',
    classNames,
    errorPlaceholder,
    menuPortalZ,
}: CategorySelectProps) {
    const { t, i18n } = useTranslation()

    const {
        data: categoriesData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useGetAllCategoriesSelect()

    const pageLanguage = i18n.language

    const categoryOptions = useMemo<SelectOption<CategoryId>[]>(() => {
        return (
            categoriesData?.items?.map((cat: Category) => {
                const byPageLang = cat.translations.find(
                    (t) => t.languageCode === pageLanguage,
                )?.value

                const byFallbackLang = cat.translations.find(
                    (t) => t.languageCode === fallbackLanguage,
                )?.value

                const label = byPageLang || byFallbackLang || cat.slug

                return {
                    label,
                    value: cat.id,
                }
            }) ?? []
        )
    }, [categoriesData, pageLanguage, fallbackLanguage])

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
        />
    )
}

export default CategorySelect
