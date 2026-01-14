import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/* ------------------ Types ------------------ */

type FilterOption = { label: string; value: string }

export type ServerFilterConfig = {
  key: string
  label?: string
  value: string
  options: FilterOption[]
  placeholder?: string
  hidden?: boolean
}

type ParamsValue = string | number | undefined

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

  const [filters, setFilters] = useState<ServerFilterConfig[]>(() =>
    initialFilters.map((f) => ({
      ...f,
      value: searchParams.get(f.key) ?? f.value ?? '',
    }))
  )

  /* ---------- 2) Debounced search (for API only) ---------- */

  const debouncedSearchValue = useDebouncedValue(searchValue, debounceMs)

  /* ---------- 3) Build params for API ---------- */

  const params = useMemo(() => {
    const q = debouncedSearchValue.trim()

    const p: Record<string, ParamsValue> = {
      [searchParamKey]: q !== '' ? q : undefined,
      [pageParamKey]: currentPage,
      [limitParamKey]: pageSize,
    }

    filters.forEach((f) => {
      if (f.hidden) return
      const v = f.value.trim()
      if (v !== '') p[f.key] = v
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

  /* ---------- 4) Sync state → URL (clean URL) ---------- */

  useEffect(() => {
    const next = new URLSearchParams()

    const q = searchValue.trim()
    if (q !== '') next.set(searchParamKey, q)

    // page يظهر فقط لو > 1
    if (currentPage > 1) next.set(pageParamKey, String(currentPage))

    // ❌ لا نكتب limit في الـ URL (دايمًا)
    // لو حبيت تضيفه لاحقًا عند تغيير pageSize، نعملها بسهولة

    filters.forEach((f) => {
      if (f.hidden) return
      const v = f.value.trim()
      if (v !== '') next.set(f.key, v)
    })

    setSearchParams(next, { replace: true })
  }, [
    searchValue,
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

  const onFilterChange = useCallback((key: string, value: string) => {
    setCurrentPage(1)
    setFilters((prev) =>
      prev.map((f) => (f.key === key ? { ...f, value } : f))
    )
  }, [])

  const clearAll = useCallback(() => {
    setSearchValue('')
    setCurrentPage(1)
    setFilters((prev) => prev.map((f) => ({ ...f, value: '' })))
  }, [])

  /* ---------- 6) Public API ---------- */

  return {
    // state
    searchValue,
    currentPage,
    pageSize,
    filters,

    // actions
    onSearchChange,
    onFilterChange,
    clearAll,
    setCurrentPage,

    // API params (debounced search)
    params,
  }
}
