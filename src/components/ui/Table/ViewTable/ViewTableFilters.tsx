import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { HiOutlineSearch } from 'react-icons/hi'
import { InfinityControls } from '@/utils/hooks/useServerTable'

export type FilterValue = string | number | boolean

export interface FilterOption {
    label: string
    value: FilterValue
}

export interface FilterConfig {
    key: string
    label?: string
    value: FilterValue | null
    options: FilterOption[]
    placeholder?: string
    hidden?: boolean
    infinity?: InfinityControls
}

export interface ViewTableFiltersProps {
    showSearch?: boolean
    searchPlaceholder?: string
    searchValue: string
    onSearchChange: (value: string) => void
    filters?: FilterConfig[]
    onFilterChange?: (key: string, value: FilterValue | null) => void
    showClearAll?: boolean
    onClearAll?: () => void
}

const isSameValue = (a: FilterValue, b: FilterValue) => {
    if (a === b) return true
    // normalize common cases between URL-string and raw values
    if (typeof a === 'boolean' && typeof b === 'string') return String(a) === b
    if (typeof a === 'string' && typeof b === 'boolean') return a === String(b)

    if (typeof a === 'number' && typeof b === 'string') return String(a) === b
    if (typeof a === 'string' && typeof b === 'number')
        return Number(a) === b && a.trim() !== ''

    return false
}

const ViewTableFilters = ({
    showSearch = true,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    filters = [],
    onFilterChange,
    showClearAll = true,
    onClearAll,
}: ViewTableFiltersProps) => {
    const { t } = useTranslation()
    const visibleFilters = useMemo(
        () => filters.filter((f) => !f.hidden),
        [filters],
    )

    const hasActiveFilters = useMemo(() => {
        const hasSearch = showSearch && searchValue.trim() !== ''
        const hasFilterValues = visibleFilters.some((f) => f.value !== null)
        return hasSearch || hasFilterValues
    }, [showSearch, searchValue, visibleFilters])

    const handleClearAll = () => {
        if (onClearAll) {
            onClearAll()
            return
        }

        onSearchChange('')
        visibleFilters.forEach((f) => onFilterChange?.(f.key, null))
    }
    
    return (
        <div className="px-3 md:px-5 py-3">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center">
                {/* Search */}
                {showSearch && (
                    <div className="max-w-[400px] flex-1 w-full md:w-auto min-w-0">
                        <Input
                            prefix={
                                <HiOutlineSearch className="text-gray-400" />
                            }
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            className="rounded-xl"
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                )}

                {/* Dropdown filters */}
                {visibleFilters.map((filter) => {
                    const selectedOption =
                        filter.value !== null
                            ? (filter.options.find((opt) =>
                                  isSameValue(
                                      opt.value,
                                      filter.value as FilterValue,
                                  ),
                              ) ?? null)
                            : null

                    return (
                        <div
                            key={filter.key}
                            className="flex items-center gap-2 flex-shrink-0"
                        >
                            {filter.label && (
                                <label className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                    {filter.label}
                                </label>
                            )}

                            <div className="min-w-[140px]">
                                <Select<FilterOption>
                                    size="sm"
                                    isSearchable={false}
                                    placeholder={filter.placeholder || t('viewTable.filters.all')}
                                    value={selectedOption}
                                    options={filter.options}
                                    maxMenuHeight={230}
                                    hasMore={filter?.infinity?.hasNextPage}
                                    isLoadingMore={filter?.infinity?.isFetching}
                                    loadMoreLabel={t('viewTable.filters.loadMore')}
                                    onLoadMore={() =>
                                        filter?.infinity?.fetchNextPage()
                                    }
                                    onChange={(option) =>
                                        onFilterChange?.(
                                            filter.key,
                                            option?.value ?? null,
                                        )
                                    }
                                />
                            </div>
                        </div>
                    )
                })}

                {/* Clear All */}
                {showClearAll && hasActiveFilters && (
                    <div className="ml-auto md:ml-0">
                        <button
                            type="button"
                            className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer whitespace-nowrap"
                            onClick={handleClearAll}
                        >
                            {t('viewTable.filters.clearAll')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewTableFilters
