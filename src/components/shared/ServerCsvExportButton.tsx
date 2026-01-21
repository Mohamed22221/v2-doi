import { useCallback } from 'react'
import CsvExportButton from './CsvExportButton'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

interface ServerCsvExportButtonProps<T> {
    /** The base service method to fetch paginated data (e.g. CategoriesServices.getAllCategories) */
    serviceMethod: (params: string) => Promise<any>
    /** Prefix for the generated CSV filename */
    fileNamePrefix: string
    /** CSV column definitions */
    columns: CsvColumnDef<T>[]
    /** Current visible table data for 'Export Current Page' */
    currentData?: T[]
    /** Optional CSS class for the button */
    className?: string
}

/**
 * A wrapper around CsvExportButton that automatically handles 
 * the wiring logic for server-side paginated tables.
 */
export default function ServerCsvExportButton<T>({
    serviceMethod,
    fileNamePrefix,
    columns,
    currentData,
    className,
}: ServerCsvExportButtonProps<T>) {

    const fetchPage = useCallback(
        async (page: number, limit: number) => {
            const searchParams = new URLSearchParams(window.location.search)
            searchParams.set('page', String(page))
            searchParams.set('limit', String(limit))

            const response = await serviceMethod(searchParams.toString())

            return {
                items: response?.data?.items ?? [],
                total: response?.data?.total ?? 0,
            }
        },
        [serviceMethod],
    )

    return (
        <CsvExportButton
            fileNamePrefix={fileNamePrefix}
            columns={columns}
            currentData={currentData}
            fetchPage={fetchPage}
            className={className}
        />
    )
}
