/**
 * Utility functions for frontend-only CSV generation and download.
 */

export interface CsvColumnDef<T> {
    header: string
    accessor: (row: T) => string | number | boolean | null | undefined
}

/**
 * Escapes characters that have special meaning in CSV (quotes, commas, newlines).
 */
export const escapeCsvValue = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return ''
    const stringVal = String(val)
    if (/[",\n\r]/.test(stringVal)) {
        return `"${stringVal.replace(/"/g, '""')}"`
    }
    return stringVal
}

/**
 * Converts an array of objects to a CSV string based on column definitions.
 */
export const generateCsvString = <T>(
    data: T[],
    columns: CsvColumnDef<T>[],
    includeHeaders = true
): string => {
    const csvRows: string[] = []

    if (includeHeaders) {
        csvRows.push(columns.map((col) => escapeCsvValue(col.header)).join(','))
    }

    data.forEach((row) => {
        csvRows.push(
            columns.map((col) => escapeCsvValue(col.accessor(row))).join(',')
        )
    })

    return csvRows.join('\n')
}

/**
 * Triggers a browser download of a CSV file.
 * Includes UTF-8 BOM for Excel compatibility.
 */
export const downloadCsv = (csvContent: string, fileName: string) => {
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${fileName}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
