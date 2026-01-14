import { useMemo } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { HiOutlineSearch } from 'react-icons/hi'

export interface FilterOption {
    label: string
    value: string
}

export interface FilterConfig {
    /** Unique key used to build query params, e.g. "status", "category" */
    key: string
    label?: string
    value: string
    options: FilterOption[]
    placeholder?: string
    hidden?: boolean
}

export interface ViewTableFiltersProps {
    showSearch?: boolean
    searchPlaceholder?: string
    searchValue: string
    onSearchChange: (value: string) => void

    filters?: FilterConfig[]
    onFilterChange?: (key: string, value: string) => void

    showClearAll?: boolean
    onClearAll?: () => void
}

const ViewTableFilters = ({
    showSearch = true,
    searchPlaceholder = 'Search...',
    searchValue,
    onSearchChange,
    filters = [],
    onFilterChange,
    showClearAll = true,
    onClearAll,
}: ViewTableFiltersProps) => {
    const visibleFilters = useMemo(
        () => filters.filter((f) => !f.hidden),
        [filters]
    )

    const hasActiveFilters = useMemo(() => {
        const hasSearch = showSearch && searchValue.trim() !== ''
        const hasFilterValues = visibleFilters.some((f) => f.value.trim() !== '')
        return hasSearch || hasFilterValues
    }, [showSearch, searchValue, visibleFilters])

    const handleClearAll = () => {
        if (onClearAll) {
            onClearAll()
            return
        }

        // Default clear behavior (controlled from parent)
        onSearchChange('')
        visibleFilters.forEach((f) => onFilterChange?.(f.key, ''))
    }

    return (
        <div className="px-3 md:px-5 py-3">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-center">
                {/* Search */}
                {showSearch && (
                    <div className="max-w-[400px] flex-1 w-full md:w-auto min-w-0">
                        <Input
                            prefix={<HiOutlineSearch className="text-gray-400" />}
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="rounded-xl"
                        />
                    </div>
                )}

                {/* Dropdown filters */}
                {visibleFilters.map((filter) => (
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
                                placeholder={filter.placeholder || 'All'}
                                value={
                                    filter.value
                                        ? filter.options.find(
                                              (opt) => opt.value === filter.value
                                          ) ?? null
                                        : null
                                }
                                options={filter.options}
                                onChange={(option) =>
                                    onFilterChange?.(filter.key, option?.value ?? '')
                                }
                            />
                        </div>
                    </div>
                ))}

                {/* Clear All */}
                {showClearAll && hasActiveFilters && (
                    <div className="ml-auto md:ml-0">
                        <button
                            onClick={handleClearAll}
                            type="button"
                            className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors cursor-pointer whitespace-nowrap"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewTableFilters
