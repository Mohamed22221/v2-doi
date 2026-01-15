import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/* ------------------ Types ------------------ */

export type FilterValue = string | number | boolean
export type FilterValueType = 'string' | 'number' | 'boolean'

export type FilterOption = { label: string; value: FilterValue }

export type ServerFilterConfig = {
  key: string
  label?: string

  /**
   * ✅ نخزن القيمة الأصلية (علشان Select يقدر يعمل match)
   * null = no filter
   */
  value: FilterValue | null

  /**
   * ✅ علشان نعرف نعمل parse من الـ URL للنوع الصح
   */
  valueType?: FilterValueType

  options: FilterOption[]
  placeholder?: string
  hidden?: boolean
}

type ParamsValue = string | number | boolean | undefined

/* ------------------ Helpers ------------------ */

// ✅ تحويل raw value لــ string للـ URL
function serializeFilterValue(v: FilterValue | null): string {
  if (v === null) return ''
  return String(v)
}

// ✅ تحويل string جاي من URL للنوع الصح
function parseFilterValue(raw: string, type: FilterValueType): FilterValue {
  if (type === 'boolean') return raw === 'true'
  if (type === 'number') {
    const n = Number(raw)
    return Number.isFinite(n) ? n : 0
  }
  return raw
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

  const [filters, setFilters] = useState<ServerFilterConfig[]>(() =>
    initialFilters.map((f) => {
      const fromUrl = searchParams.get(f.key)
      if (fromUrl === null || fromUrl.trim() === '') {
        return { ...f, value: f.value ?? null }
      }

      const type: FilterValueType = f.valueType ?? 'string'
      return { ...f, value: parseFilterValue(fromUrl, type) }
    })
  )

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
      p[f.key] = f.value // ✅ هنا بيرجع boolean/number/string أصلي
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

    const q = searchValue.trim()
    if (q !== '') next.set(searchParamKey, q)

    if (currentPage > 1) next.set(pageParamKey, String(currentPage))

    filters.forEach((f) => {
      if (f.hidden) return
      const urlV = serializeFilterValue(f.value)
      if (urlV !== '') next.set(f.key, urlV)
    })

    setSearchParams(next, { replace: true })
  }, [searchValue, currentPage, filters, searchParamKey, pageParamKey, setSearchParams])

  /* ---------- 5) Handlers ---------- */

  const onSearchChange = useCallback((v: string) => {
    setCurrentPage(1)
    setSearchValue(v)
  }, [])

  const onFilterChange = useCallback((key: string, value: FilterValue | null) => {
    setCurrentPage(1)
    setFilters((prev) => prev.map((f) => (f.key === key ? { ...f, value } : f)))
  }, [])

  const clearAll = useCallback(() => {
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

    params,
  }
}
