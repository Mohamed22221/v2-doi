import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import Button from '../../Button'
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
    headerActions
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
    })


    return (
        <div>
            <div className="px-3 md:px-5 flex justify-between items-center md:h-[90px] h-[70px]">
                <h3 className="text-[17px] md:text-[24px]">{title || t('viewTable.defaultTitle')}</h3>
                <div className="flex items-center gap-2">
                    {headerActions}
                    {showExportButton && (
                        <Button
                            size="md"
                            icon={
                                <HiDownload className="text-primary-500 dark:text-primary-100" />
                            }
                            onClick={onExport}
                        >
                            {exportButtonText || t('viewTable.defaultExportButtonText')}
                        </Button>
                    )}
                </div>
            </div>

            <hr className="py-3" />

            <ViewTableFilters
                showSearch={showSearch}
                searchPlaceholder={searchPlaceholder || t('viewTable.defaultSearchPlaceholder')}
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
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
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
