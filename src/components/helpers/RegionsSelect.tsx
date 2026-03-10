import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from '@/components/ui'
import { useGetAllRegionsSelect } from '@/api/hooks/regions'
import { getApiErrorMessage } from '@/api/error'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'

type SelectOption = { value: string; label: string }

type RegionLike = { id: string; name: string; nameAr: string }

type RegionsSelectProps = {
    value: string | null
    onChange: (value: string | null) => void
    placeholder?: string
    size?: 'sm' | 'md' | 'lg'
    maxMenuHeight?: number
    isDisabled?: boolean
    classNames?: string
    errorPlaceholder?: string
    menuPortalZ?: number
    /**
     * Full or partial Region object to pre-populate the selected option in edit mode.
     * Skips the need for a separate "get by ID" fetch.
     */
    initialOption?: RegionLike | null
}

function RegionsSelect({
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
}: RegionsSelectProps) {
    const { t, i18n } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 400)

    const {
        data: regionsData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useGetAllRegionsSelect(debouncedSearchQuery)

    const isAr = i18n.language === 'ar'

    const regionOptions = useMemo<SelectOption[]>(() => {
        const list: SelectOption[] =
            regionsData?.items?.map((r) => ({
                label: isAr ? r.nameAr : r.name,
                value: r.id,
            })) ?? []

        // Prepend the initial option if it isn't already in the list
        if (initialOption && !list.some((o) => o.value === initialOption.id)) {
            list.unshift({
                label: isAr ? initialOption.nameAr : initialOption.name,
                value: initialOption.id,
            })
        }

        return list
    }, [regionsData, isAr, initialOption])

    const selectedOption = useMemo<SelectOption | null>(
        () => regionOptions.find((o) => o.value === value) ?? null,
        [regionOptions, value],
    )

    const resolvedPlaceholder = useMemo(() => {
        if (!isError)
            return (
                placeholder ??
                t('locations.cities.modal.fields.regionPlaceholder')
            )
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
            options={regionOptions}
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

export default RegionsSelect
