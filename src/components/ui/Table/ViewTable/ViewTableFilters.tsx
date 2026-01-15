import { useMemo } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { HiOutlineSearch } from 'react-icons/hi'

export type FilterValue = string | number | boolean

export interface FilterOption {
    label: string
    value: FilterValue
}

export interface FilterConfig {
    key: string
    label?: string
    /**
     * ✅ القيمة المخزنة/المتحكم فيها (raw):
     * - null = All / no filter
     * - string | number | boolean = القيمة الأصلية
     */
    value: FilterValue | null
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
    /**
     * ✅ بيرجع القيمة الأصلية (boolean/number/string) أو null للـ All
     */
    onFilterChange?: (key: string, value: FilterValue | null) => void

    showClearAll?: boolean
    onClearAll?: () => void
}

/**
 * ✅ Helper: يضمن إن الـ Select يلاقي الـ option صح حتى لو حصل mismatch
 * مثال: filter.value = "false" (string) و option.value = false (boolean)
 */
const isSameValue = (a: FilterValue, b: FilterValue) => {
    if (a === b) return true
    // normalize common cases between URL-string and raw values
    if (typeof a === 'boolean' && typeof b === 'string')
        return String(a) === b
    if (typeof a === 'string' && typeof b === 'boolean')
        return a === String(b)

    if (typeof a === 'number' && typeof b === 'string') return String(a) === b
    if (typeof a === 'string' && typeof b === 'number')
        return Number(a) === b && a.trim() !== ''

    return false
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
                            prefix={<HiOutlineSearch className="text-gray-400" />}
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="rounded-xl"
                        />
                    </div>
                )}

                {/* Dropdown filters */}
                {visibleFilters.map((filter) => {
                    const selectedOption =
                        filter.value !== null
                            ? filter.options.find((opt) =>
                                  isSameValue(opt.value, filter.value as FilterValue)
                              ) ?? null
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
                                    placeholder={filter.placeholder || 'All'}
                                    value={selectedOption}
                                    options={filter.options}
                                    onChange={(option) =>
                                        onFilterChange?.(
                                            filter.key,
                                            option?.value ?? null
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
