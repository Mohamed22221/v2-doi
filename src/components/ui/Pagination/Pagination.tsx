import { useState, useEffect, useMemo, useCallback } from 'react'
import Pager from './Pagers'
import Prev from './Prev'
import Next from './Next'
import Total from './Total'
import classNames from 'classnames'
import { useConfig } from '../ConfigProvider'
import type { CommonProps } from '../@types/common'

export interface PaginationProps extends CommonProps {
  currentPage?: number
  displayTotal?: boolean
  onChange?: (pageNumber: number) => void
  pageSize?: number
  total?: number 
}

const Pagination = (props: PaginationProps) => {
  const {
    className,
    currentPage = 1,
    displayTotal = false,
    onChange,
    pageSize = 1,
    total = 0,
  } = props

  const { themeColor, primaryColorLevel } = useConfig()

  const [stickyTotal, setStickyTotal] = useState<number>(
    typeof total === 'number' && total > 0 ? total : 0,
  )

  const [internalPageSize, setInternalPageSize] = useState(pageSize)


  const pageCount = useMemo(() => {
    const t = stickyTotal || 0
    const size = internalPageSize || 1

    return Math.max(1, Math.ceil(t / size))
  }, [stickyTotal, internalPageSize])

  // ✅ Clamp للصفحة الحالية
  const getValidCurrentPage = useCallback(
    (count: number | string) => {
      const value = parseInt(count as string, 10)

      let resetValue: number | undefined

      if (isNaN(value) || value < 1) resetValue = 1
      if (value > pageCount) resetValue = pageCount

      return resetValue === undefined ? value : resetValue
    },
    [pageCount],
  )

  const [internalCurrentPage, setInternalCurrentPage] = useState(() =>
    getValidCurrentPage(currentPage),
  )


  useEffect(() => {
    if (typeof total === 'number' && total > 0 && total !== stickyTotal) {
      setStickyTotal(total)
    }

    if (pageSize !== internalPageSize) {
      setInternalPageSize(pageSize)
    }


    const nextPage = getValidCurrentPage(currentPage)
    if (nextPage !== internalCurrentPage) {
      setInternalCurrentPage(nextPage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, pageSize, currentPage, getValidCurrentPage])

  const onPaginationChange = (val: number) => {
    const next = getValidCurrentPage(val)
    setInternalCurrentPage(next)
    onChange?.(next)
  }

  const onPrev = useCallback(() => {
    const next = getValidCurrentPage(internalCurrentPage - 1)
    setInternalCurrentPage(next)
    onChange?.(next)
  }, [onChange, internalCurrentPage, getValidCurrentPage])

  const onNext = useCallback(() => {
    const next = getValidCurrentPage(internalCurrentPage + 1)
    setInternalCurrentPage(next)
    onChange?.(next)
  }, [onChange, internalCurrentPage, getValidCurrentPage])

  const pagerClass = {
    default: 'pagination-pager',
    inactive: 'pagination-pager-inactive',
    active: `text-${themeColor}-${primaryColorLevel} bg-${themeColor}-50 hover:bg-${themeColor}-50 dark:bg-${themeColor}-${primaryColorLevel} dark:text-gray-100`,
    disabled: 'pagination-pager-disabled',
  }

  const paginationClass = classNames('pagination', className)


  const displayedTotal = stickyTotal

  return (
    <div className={paginationClass}>
      {displayTotal && <Total total={displayedTotal} />}

      <Prev
        currentPage={internalCurrentPage}
        pagerClass={pagerClass}
        onPrev={onPrev}
      />

      <Pager
        pageCount={pageCount}
        currentPage={internalCurrentPage}
        pagerClass={pagerClass}
        onChange={onPaginationChange}
      />

      <Next
        currentPage={internalCurrentPage}
        pageCount={pageCount}
        pagerClass={pagerClass}
        onNext={onNext}
      />
    </div>
  )
}

Pagination.displayName = 'Pagination'
export default Pagination
