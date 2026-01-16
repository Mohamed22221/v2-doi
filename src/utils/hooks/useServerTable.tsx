import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FetchNextPageOptions, InfiniteQueryObserverResult } from '@tanstack/react-query'

/* ------------------ Types ------------------ */

export type FilterValue = string | number | boolean
export type FilterValueType = 'string' | 'number' | 'boolean'

export type FilterOption = { label: string; value: FilterValue }

export type InfinityControls = {
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult>
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
  isFetching? : boolean
}

export type ServerFilterConfig = {
    key: string
    label?: string
    value: FilterValue | null
    valueType?: FilterValueType
    options: FilterOption[]
    placeholder?: string
    hidden?: boolean
    loading? : boolean
    infinity? : InfinityControls
}

type ParamsValue = string | number | boolean | undefined

/* ------------------ Helpers ------------------ */


function serializeFilterValue(v: FilterValue | null): string {
    if (v === null) return ''
    return String(v)
}


function parseFilterValue(raw: string, type: FilterValueType): FilterValue {
    if (type === 'boolean') return raw === 'true'
    if (type === 'number') {
        const n = Number(raw)
        return Number.isFinite(n) ? n : 0
    }
    return raw
}

// ✅ Deep comparison for ServerFilterConfig arrays (structure only, not values)
// This compares the filter structure (keys, labels, options) to detect when
// initialFilters changes, regardless of the value field
function deepEqualFilters(
    a: ServerFilterConfig[],
    b: ServerFilterConfig[],
): boolean {
    if (a.length !== b.length) return false

    // Create maps by key for order-independent comparison
    const mapA = new Map(a.map((f) => [f.key, f]))
    const mapB = new Map(b.map((f) => [f.key, f]))

    if (mapA.size !== mapB.size) return false

    for (const [key, filterA] of mapA) {
        const filterB = mapB.get(key)
        if (!filterB) return false

        // Compare structure properties (not value, as that's handled separately)
        if (
            filterA.key !== filterB.key ||
            filterA.valueType !== filterB.valueType ||
            filterA.hidden !== filterB.hidden ||
            filterA.loading !== filterB.loading ||
            filterA.label !== filterB.label ||
            filterA.placeholder !== filterB.placeholder
        ) {
            return false
        }

        // Compare options arrays
        if (filterA.options.length !== filterB.options.length) return false
        const optionsMapA = new Map(
            filterA.options.map((opt) => [opt.value, opt]),
        )
        const optionsMapB = new Map(
            filterB.options.map((opt) => [opt.value, opt]),
        )

        if (optionsMapA.size !== optionsMapB.size) return false
        for (const [optValue, optA] of optionsMapA) {
            const optB = optionsMapB.get(optValue)
            if (!optB || optA.label !== optB.label) return false
        }
    }

    return true
}

/* ------------------ Debounce Hook ------------------ */

function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState<T>(value)

    useEffect(() => {
        const id = window.setTimeout(() => setDebounced(value), delayMs)
        return () => window.clearTimeout(id)
    }, [value, delayMs])

    return debounced
}

/* ------------------ useServerTable ------------------ */

export function useServerTable(opts: {
    pageSize: number
    initialFilters?: ServerFilterConfig[]
    searchParamKey?: string
    pageParamKey?: string
    limitParamKey?: string
    debounceMs?: number
}) {
    const {
        pageSize,
        initialFilters = [],
        searchParamKey = 'q',
        pageParamKey = 'page',
        limitParamKey = 'limit',
        debounceMs = 400,
    } = opts

    const [searchParams, setSearchParams] = useSearchParams()

    /* ---------- 1) Read initial state from URL ---------- */

    const [searchValue, setSearchValue] = useState(() => {
        return searchParams.get(searchParamKey) ?? ''
    })

    const [currentPage, setCurrentPage] = useState(() => {
        const p = Number(searchParams.get(pageParamKey))
        return Number.isFinite(p) && p > 0 ? p : 1
    })
    const [requestedPage, setRequestedPage] = useState(currentPage)
    useEffect(() => {
        setRequestedPage(currentPage)
    }, [currentPage])

    const onPageChange = (page: number) => {
        setRequestedPage(page)
        setCurrentPage(page)
    }

    // Track if filters have been manually modified by the user
    const filtersManuallyModifiedRef = useRef(false)
    // Store previous initialFilters for deep comparison
    const prevInitialFiltersRef = useRef<ServerFilterConfig[]>(initialFilters)

    const [filters, setFilters] = useState<ServerFilterConfig[]>(() =>
        initialFilters.map((f) => {
            const fromUrl = searchParams.get(f.key)
            if (fromUrl === null || fromUrl.trim() === '') {
                return { ...f, value: f.value ?? null }
            }

            const type: FilterValueType = f.valueType ?? 'string'
            return { ...f, value: parseFilterValue(fromUrl, type) }
        }),
    )

    // Sync filters state when initialFilters changes (only if not manually modified)
    useEffect(() => {
        // Deep compare structure to detect changes in initialFilters
        const structureChanged = !deepEqualFilters(
            prevInitialFiltersRef.current,
            initialFilters,
        )

        // Check if initial values changed (for filters that exist in both)
        const prevMap = new Map(
            prevInitialFiltersRef.current.map((f) => [f.key, f]),
        )
        const valuesChanged = initialFilters.some(
            (f) => prevMap.get(f.key)?.value !== f.value,
        )

        const initialFiltersChanged = structureChanged || valuesChanged

        if (initialFiltersChanged && !filtersManuallyModifiedRef.current) {
            // Sync initialFilters to filters state, preserving URL values
            setFilters((prevFilters) => {
                // Create a map of current filter values by key for quick lookup
                const currentFilterMap = new Map(
                    prevFilters.map((f) => [f.key, f]),
                )

                return initialFilters.map((f) => {
                    const existingFilter = currentFilterMap.get(f.key)
                    const fromUrl = searchParams.get(f.key)

                    // If URL has a value, prefer it; otherwise use initialFilters value
                    if (fromUrl !== null && fromUrl.trim() !== '') {
                        const type: FilterValueType = f.valueType ?? 'string'
                        return {
                            ...f,
                            value: parseFilterValue(fromUrl, type),
                        }
                    }

                    // If we have an existing filter with a value, preserve it
                    // (this handles the case where initialFilters structure changes)
                    if (existingFilter && existingFilter.value !== null) {
                        return { ...f, value: existingFilter.value }
                    }

                    // Otherwise use the value from initialFilters
                    return { ...f, value: f.value ?? null }
                })
            })

            prevInitialFiltersRef.current = initialFilters
        } else if (structureChanged) {
            // Even if manually modified, update the structure (keys, labels, etc.)
            // but preserve user's values
            setFilters((prevFilters) => {
                const currentFilterMap = new Map(
                    prevFilters.map((f) => [f.key, f]),
                )

                return initialFilters.map((f) => {
                    const existingFilter = currentFilterMap.get(f.key)
                    if (existingFilter) {
                        // Preserve user's value, but update other properties
                        return { ...f, value: existingFilter.value }
                    }
                    // New filter from initialFilters
                    const fromUrl = searchParams.get(f.key)
                    if (fromUrl !== null && fromUrl.trim() !== '') {
                        const type: FilterValueType = f.valueType ?? 'string'
                        return {
                            ...f,
                            value: parseFilterValue(fromUrl, type),
                        }
                    }
                    return { ...f, value: f.value ?? null }
                })
            })

            prevInitialFiltersRef.current = initialFilters
        } else if (valuesChanged) {
            // Structure unchanged but values changed - update ref for next comparison
            prevInitialFiltersRef.current = initialFilters
        }
    }, [initialFilters, searchParams])
    /* ---------- 2) Debounced search (for API only) ---------- */

    const debouncedSearchValue = useDebouncedValue(searchValue, debounceMs)

    /* ---------- 3) Build params for API (✅ raw values) ---------- */

    const params = useMemo(() => {
        const q = debouncedSearchValue.trim()

        const p: Record<string, ParamsValue> = {
            [searchParamKey]: q !== '' ? q : undefined,
            [pageParamKey]: currentPage,
            [limitParamKey]: pageSize,
        }

        filters.forEach((f) => {
            if (f.hidden) return
            if (f.value === null) return
            p[f.key] = f.value
        })

        return p
    }, [
        debouncedSearchValue,
        currentPage,
        pageSize,
        filters,
        searchParamKey,
        pageParamKey,
        limitParamKey,
    ])

    /* ---------- 4) Sync state → URL (✅ serialize raw) ---------- */

useEffect(() => {
  const next = new URLSearchParams()


  const rawQ = searchValue.trim()
  const qForUrl = rawQ === '' ? '' : debouncedSearchValue.trim()

  if (qForUrl !== '') next.set(searchParamKey, qForUrl)

  if (currentPage > 1) next.set(pageParamKey, String(currentPage))

  filters.forEach((f) => {
    if (f.hidden) return
    const urlV = serializeFilterValue(f.value)
    if (urlV !== '') next.set(f.key, urlV)
  })

  setSearchParams(next, { replace: true })
}, [
  searchValue,          
  debouncedSearchValue,  
  currentPage,
  filters,
  searchParamKey,
  pageParamKey,
  setSearchParams,
])

    /* ---------- 5) Handlers ---------- */

    const onSearchChange = useCallback((v: string) => {
        setCurrentPage(1)
        setSearchValue(v)
    }, [])

    const onFilterChange = useCallback(
        (key: string, value: FilterValue | null) => {
            filtersManuallyModifiedRef.current = true
            setCurrentPage(1)
            setFilters((prev) =>
                prev.map((f) => (f.key === key ? { ...f, value } : f)),
            )
        },
        [],
    )

    const clearAll = useCallback(() => {
        filtersManuallyModifiedRef.current = false
        setSearchValue('')
        setCurrentPage(1)
        setFilters((prev) => prev.map((f) => ({ ...f, value: null })))
    }, [])

    return {
        searchValue,
        currentPage,
        pageSize,
        filters,
        onSearchChange,
        onFilterChange,
        clearAll,
        setCurrentPage,
        onPageChange,
        requestedPage,
        params,
    }
}
