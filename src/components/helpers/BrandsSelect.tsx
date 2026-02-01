import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui'
import {
    useGetAllBrandsSelect,
    useGetBrandById,
} from '@/api/hooks/brands'
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
    /** ID of the pre-selected brand in update mode to fetch its details */
    initialId?: BrandId | null
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
    initialId,
}: BrandsSelectProps) {
    const { t, i18n } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 400)

    const {
        data: brandsData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading: isListLoading,
        isError,
        error,
    } = useGetAllBrandsSelect(debouncedSearchQuery)

    const { brand: initialBrand, isLoading: isInitialLoading } =
        useGetBrandById(initialId as string, {
            enabled: Boolean(initialId),
        })

    const isLoading = isListLoading || isInitialLoading

    const pageLanguage = i18n.language

    const brandOptions = useMemo<SelectOption<BrandId>[]>(() => {
        const fetchedOptions =
            brandsData?.items?.map((brand: Brand) => {
                const byPageLang = brand.translations.find(
                    (tr) => tr.languageCode.toLowerCase() === i18n.language.toLowerCase(),
                )?.name

                const label = byPageLang || brand.slug

                return {
                    label,
                    value: brand.id,
                }
            }) ?? []

        // If we have an initialId and fetched its details, ensure it's in the list
        if (
            initialBrand &&
            !fetchedOptions.some((o) => o.value === initialBrand.id)
        ) {
            const byPageLang = initialBrand.translations?.find(
                (tr) => tr.languageCode.toLowerCase() === i18n.language.toLowerCase(),
            )?.name

            const label = byPageLang || initialBrand.slug

            return [{ label, value: initialBrand.id }, ...fetchedOptions]
        }

        return fetchedOptions
    }, [brandsData, i18n.language, initialBrand])

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
