import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { HiOutlineSearch } from 'react-icons/hi'
import { InfinityControls, FilterConfigType } from '@/utils/hooks/useServerTable'
import DatePicker from '../../DatePicker'

export type FilterValue = string | number | boolean

export interface FilterOption {
    label: string
    value: FilterValue
}

export interface FilterConfig {
    key: string
    label?: string
    value: FilterValue | null
    dateValue?: Date | null
    options: FilterOption[]
    placeholder?: string
    hidden?: boolean
    infinity?: InfinityControls
    type?: FilterConfigType
}

export interface ViewTableFiltersProps {
    showSearch?: boolean
    searchPlaceholder?: string
    searchValue: string
    onSearchChange: (value: string) => void
    filters?: FilterConfig[]
    onFilterChange?: (key: string, value: FilterValue | null) => void
    onDateFilterChange?: (key: string, date: Date | null) => void
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
    onDateFilterChange,
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
        const hasFilterValues = visibleFilters.some(
            (f) => f.value !== null || f.dateValue !== null
        )
        return hasSearch || hasFilterValues
    }, [showSearch, searchValue, visibleFilters])

    const handleClearAll = () => {
        if (onClearAll) {
            onClearAll()
            return
        }

        onSearchChange('')
        visibleFilters.forEach((f) => {
            onFilterChange?.(f.key, null)
            onDateFilterChange?.(f.key, null)
        })
    }

    return (
        <div className="px-3 md:px-5 py-3 overflow-x-hidden">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
                {/* Search */}
                {showSearch && (
                    <div className="w-full md:w-[260px] min-w-[200px]">
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
                                <label className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium">
                                    {filter.label}
                                </label>
                            )}
                            {filter.type !== 'date' && filter.type !== 'year' && (
                                <div className="min-w-[160px] max-w-[220px]">
                                    <Select<FilterOption>

                                        size="sm"
                                        isSearchable={false}
                                        placeholder={
                                            filter.placeholder ||
                                            t('viewTable.filters.all')
                                        }
                                        value={selectedOption}
                                        options={filter.options}
                                        maxMenuHeight={230}
                                        hasMore={filter?.infinity?.hasNextPage}
                                        isLoadingMore={
                                            filter?.infinity?.isFetching
                                        }
                                        loadMoreLabel={t(
                                            'viewTable.filters.loadMore',
                                        )}
                                        onLoadMore={() =>
                                            filter?.infinity?.fetchNextPage()
                                        }
                                        onChange={(option) =>
                                            onFilterChange?.(
                                                filter.key,
                                                option?.value ?? null,
                                            )
                                        }
                                        isClearable
                                    />
                                </div>
                            )}

                            {filter.type === 'year' && (
                                <div className="min-w-[120px]">
                                    <DatePicker
                                        size="sm"
                                        placeholder={
                                            filter.placeholder ?? t('viewTable.filters.all')
                                        }
                                        value={filter.dateValue ?? null}
                                        inputFormat="YYYY"
                                        defaultView="year"
                                        viewOnly="year"
                                        minDate={new Date(1900, 0, 1)}
                                        maxDate={new Date()}
                                        clearable
                                        onChange={(date: Date | null) => {
                                            onDateFilterChange?.(filter.key, date)
                                        }}
                                    />
                                </div>

                            )}

                            {filter.type === 'date' && (
                                <div className="min-w-[150px]">
                                    <DatePicker
                                        size="sm"
                                        placeholder={
                                            filter.placeholder ||
                                            t('viewTable.filters.all')
                                        }
                                        value={filter.dateValue ?? null}
                                        clearable
                                        onChange={(date) =>
                                            onDateFilterChange?.(
                                                filter.key,
                                                date,
                                            )
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}

                {/* Clear All */}
                {showClearAll && hasActiveFilters && (
                    <div className="flex-shrink-0">
                        <button
                            type="button"
                            className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer whitespace-nowrap font-semibold"
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
