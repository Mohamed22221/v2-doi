import { useState, useCallback, useRef } from 'react'
import { CsvColumnDef, generateCsvString, downloadCsv } from '../csv/csv.utils'
import dayjs from 'dayjs'

export interface ExportOptions<T> {
    fileNamePrefix: string
    columns: CsvColumnDef<T>[]
    /** Function to fetch a single page of data. Used for "Export All". */
    fetchPage?: (page: number, limit: number) => Promise<{ items: T[]; total: number }>
    /** Current table data. Used for "Export Current Page". */
    currentData?: T[]
}

export const useCsvExport = <T>(options: ExportOptions<T>) => {
    const { fileNamePrefix, columns, fetchPage, currentData } = options
    const [isExporting, setIsExporting] = useState(false)
    const [progress, setProgress] = useState(0)
    const cancelRef = useRef(false)

    const generateFileName = useCallback(() => {
        return `${fileNamePrefix}_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}`
    }, [fileNamePrefix])

    const exportCurrentPage = useCallback(() => {
        if (!currentData || currentData.length === 0) return
        const csv = generateCsvString(currentData, columns)
        downloadCsv(csv, generateFileName())
    }, [currentData, columns, generateFileName])

    const exportAll = useCallback(async () => {
        if (!fetchPage) return

        setIsExporting(true)
        setProgress(0)
        cancelRef.current = false

        try {
            let allCsvContent = ''
            let currentPage = 1
            const limit = 100 // Batch size for efficiency
            let totalFetched = 0
            let totalToFetch = 1

            while (totalFetched < totalToFetch) {
                if (cancelRef.current) break

                const { items, total } = await fetchPage(currentPage, limit)
                totalToFetch = total

                if (items.length === 0) break

                const includeHeaders = currentPage === 1
                const pageCsv = generateCsvString(items, columns, includeHeaders)

                allCsvContent += (allCsvContent ? '\n' : '') + pageCsv
                totalFetched += items.length

                setProgress(Math.round((totalFetched / totalToFetch) * 100))
                currentPage++
            }

            if (!cancelRef.current && allCsvContent) {
                downloadCsv(allCsvContent, generateFileName())
            }
        } catch (error) {
            console.error('CSV Export failed:', error)
            // You might want to trigger a toast notification here if you have one available
        } finally {
            setIsExporting(false)
            setProgress(0)
        }
    }, [fetchPage, columns, generateFileName])

    const cancelExport = useCallback(() => {
        cancelRef.current = true
    }, [])

    return {
        exportCurrentPage,
        exportAll,
        isExporting,
        progress,
        cancelExport,
    }
}
