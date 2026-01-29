import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui'
import { useGetAllBrandsSelect } from '@/api/hooks/brands'
import type { Brand } from '@/api/types/brands'
import { getApiErrorMessage } from '@/api/error'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'

type SelectOption<TValue extends string = string> = {
    value: TValue
    label: string
}

type BrandId = Brand['id']

type BrandsSelectProps = {
    value: BrandId | null
    onChange: (value: BrandId | null) => void
    placeholder?: string
    size?: 'sm' | 'md' | 'lg'
    maxMenuHeight?: number
    isDisabled?: boolean
    menuPortalZ?: number
    classNames?: string
    errorPlaceholder?: string
    /** Pre-selected option for update mode (e.g., brand from details) */
    initialOption?: { value: BrandId; label: string } | null
}

function BrandsSelect({
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
}: BrandsSelectProps) {
    const { t, i18n } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 400)

    const {
        data: brandsData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useGetAllBrandsSelect(debouncedSearchQuery)

    const pageLanguage = i18n.language

    const brandOptions = useMemo<SelectOption<BrandId>[]>(() => {
        const fetchedOptions =
            brandsData?.items?.map((brand: Brand) => {
                const byPageLang = brand.translations.find(
                    (tr) => tr.languageCode.toLowerCase() === pageLanguage,
                )?.name

                const label = byPageLang || brand.slug

                return {
                    label,
                    value: brand.id,
                }
            }) ?? []

        // If we have an initialOption, ensure it's in the list
        if (initialOption && !fetchedOptions.some((o) => o.value === initialOption.value)) {
            return [initialOption, ...fetchedOptions]
        }

        return fetchedOptions
    }, [brandsData, pageLanguage, initialOption])

    const selectedOption = useMemo<SelectOption<BrandId> | null>(() => {
        return brandOptions.find((o) => o.value === value) ?? null
    }, [brandOptions, value])

    const resolvedPlaceholder = useMemo(() => {
        if (!isError) return placeholder ?? t('models.selectBrand')

        const apiMessage = getApiErrorMessage(error)
        return apiMessage || errorPlaceholder
    }, [isError, error, placeholder, errorPlaceholder, t])

    return (
        <Select
            menuPortalZ={menuPortalZ}
            className={classNames}
            size={size}
            maxMenuHeight={maxMenuHeight}
            placeholder={resolvedPlaceholder}
            options={brandOptions}
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

export default BrandsSelect
