import { ReactNode, useMemo } from 'react'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { ConnectDragSource } from 'react-dnd'
import Button from '../../Button'
import DraggableRow from './DraggableRow'
import { HiDownload } from 'react-icons/hi'
import ViewTableFilters, {
    FilterValue,
    type FilterConfig,
} from './ViewTableFilters'
import { TableRowSkeleton } from '@/components/shared'
import ErrorState from '@/components/shared/ErrorState'
import EmptyState from '@/components/shared/EmptyState'

type Option = {
    value: number
    label: string
}

export interface ViewTableProps<TData extends object = object> {
    title?: string
    showExportButton?: boolean
    exportButtonText?: string
    onExport?: () => void
    columns: ColumnDef<TData>[]
    data: TData[]
    /** Server-side pagination */
    total: number
    pageSize: number
    onPageChange: (page: number) => void
    /** Optional: if you support changing page size */
    pageSizeOptions?: Option[]
    onPageSizeChange?: (pageSize: number) => void
    /** Server-side query controls */
    showSearch?: boolean
    searchPlaceholder?: string
    searchValue: string
    onSearchChange: (value: string) => void
    filters?: FilterConfig[]
    onFilterChange?: (key: string, value: FilterValue | null) => void
    onDateFilterChange?: (key: string, date: Date | null) => void
    showClearAll?: boolean
    onClearAll?: () => void
    isLoading?: boolean
    avatarInColumns?: number[]
    emptyText?: string
    isError?: boolean
    errorText?: string
    requestedPage: number
    headerActions?: ReactNode
    getRowClassName?: (row: TData) => string
    isRowDeleted?: (row: TData) => boolean
    /** Enable row drag-and-drop reordering (default: false) */
    enableDrag?: boolean
    /** Called when a row is dragged to a new position */
    onRowReorder?: (dragIndex: number, hoverIndex: number) => void
    /** Called when a reorder operation is completed */
    onReorderEnd?: (item: TData, newIndex: number) => void
    /** Accessor to get a unique id from row data (defaults to 'id') */
    getRowId?: (row: TData) => string | number
    /** Optional: filter which rows can be dragged */
    canDragRow?: (row: TData) => boolean
    /** Optional: filter which rows can be drop targets */
    canDropOnRow?: (row: TData) => boolean
}

const { Tr, Th, Td, THead, TBody } = Table

const ViewTable = <TData extends object>({
    title,
    showExportButton = true,
    exportButtonText,
    onExport,
    columns,
    data,
    total,
    pageSize,
    onPageChange,
    showSearch = true,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    filters = [],
    onFilterChange,
    onDateFilterChange,
    showClearAll = true,
    onClearAll,
    isLoading,
    avatarInColumns,
    emptyText,
    isError,
    errorText,
    requestedPage,
    headerActions,
    getRowClassName,
    isRowDeleted,
    enableDrag = false,
    onRowReorder,
    onReorderEnd,
    getRowId,
    canDragRow,
    canDropOnRow,
}: ViewTableProps<TData>) => {
    const { t } = useTranslation()
    // Make sure filters always have a value string (controlled)
    const safeFilters = useMemo<FilterConfig[]>(
        () =>
            filters.map((f) => ({
                ...f,
                value: f.value ?? '',
            })),
        [filters],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row, index) => {
            if (getRowId) return String(getRowId(row))
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (row as any).id ?? String(index)
        },
    })

    return (
        <div>
            {title && (
                <>
                    <div className="px-4 md:px-5 flex flex-col md:flex-row md:justify-between md:items-center py-4 md:py-0 md:h-[90px] min-h-[70px] gap-4">
                        <h3 className="text-[17px] md:text-[24px] font-semibold">
                            {title || t('viewTable.defaultTitle')}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                            {headerActions}
                            {showExportButton && (
                                <Button
                                    size="sm md:md"
                                    icon={
                                        <HiDownload className="text-primary-500 dark:text-primary-100" />
                                    }
                                    onClick={onExport}
                                >
                                    {exportButtonText ||
                                        t('viewTable.defaultExportButtonText')}
                                </Button>
                            )}
                        </div>
                    </div>
                    <hr className="py-3" />
                </>
            )}

            <ViewTableFilters
                showSearch={showSearch}
                searchPlaceholder={
                    searchPlaceholder || t('viewTable.defaultSearchPlaceholder')
                }
                searchValue={searchValue}
                filters={safeFilters}
                showClearAll={showClearAll}
                onClearAll={onClearAll}
                onSearchChange={onSearchChange}
                onFilterChange={onFilterChange}
                onDateFilterChange={onDateFilterChange}
            />

            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <Th key={header.id} colSpan={header.colSpan}>
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )}
                                </Th>
                            ))}
                        </Tr>
                    ))}
                </THead>
                {isLoading ? (
                    <TableRowSkeleton
                        columns={columns.length}
                        rows={pageSize}
                        avatarInColumns={avatarInColumns}
                    />
                ) : (
                    <TBody>
                        {table.getRowModel().rows.map((row, rowIndex) => {
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            const rowData = row.original as any
                            const deleted = isRowDeleted
                                ? isRowDeleted(row.original)
                                : !!rowData.deletedAt ||
                                  rowData.isDeleted === true

                            const rowThemeClass = getRowClassName
                                ? getRowClassName(row.original)
                                : ''

                            const rowClassName = classNames(
                                rowThemeClass,
                                deleted && 'bg-red-50 dark:bg-red-900/10',
                            )

                            const cells = (dragRef?: ConnectDragSource) =>
                                row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
                                        {cell.column.id === 'drag-handle' &&
                                        dragRef
                                            ? flexRender(
                                                  cell.column.columnDef.cell,
                                                  {
                                                      ...cell.getContext(),
                                                      dragRef,
                                                  },
                                              )
                                            : flexRender(
                                                  cell.column.columnDef.cell,
                                                  cell.getContext(),
                                              )}
                                    </Td>
                                ))

                            if (enableDrag && onRowReorder) {
                                return (
                                    <DraggableRow
                                        key={row.id}
                                        id={row.id}
                                        index={rowIndex}
                                        className={rowClassName}
                                        canDrag={
                                            canDragRow
                                                ? canDragRow(row.original)
                                                : true
                                        }
                                        canDrop={
                                            canDropOnRow
                                                ? canDropOnRow(row.original)
                                                : true
                                        }
                                        onMoveRow={onRowReorder}
                                        onReorderEnd={(newIndex) =>
                                            onReorderEnd?.(
                                                row.original,
                                                newIndex,
                                            )
                                        }
                                    >
                                        {(dragRef) => cells(dragRef)}
                                    </DraggableRow>
                                )
                            }

                            return (
                                <Tr key={row.id} className={rowClassName}>
                                    {cells()}
                                </Tr>
                            )
                        })}
                    </TBody>
                )}
            </Table>
            {!isLoading && data.length === 0 && isError && (
                <ErrorState message={errorText} />
            )}
            {!isLoading && !isError && data.length === 0 && (
                <EmptyState text={emptyText} />
            )}

            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={pageSize}
                    currentPage={requestedPage}
                    total={total}
                    onChange={onPageChange}
                />
                <div style={{ minWidth: 130 }} />
            </div>
        </div>
    )
}

export default ViewTable
