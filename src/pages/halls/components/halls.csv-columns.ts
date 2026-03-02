import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HallItem } from '@/api/types/halls'
import { CsvColumnDef } from '@/utils/csv/csv.utils'
import { formatDateTime } from '@/utils/formatDateTime'
import { getStatusLabel } from './GetStatusLabel'

export const useHallsCsvColumns = () => {
    const { t } = useTranslation()

    return useMemo<CsvColumnDef<HallItem>[]>(
        () => [
            {
                header: t('halls.table.columns.hallName'),
                accessor: (row: HallItem) =>
                    row.translations?.[0]?.name || row.id || '',
            },
            {
                header: t('halls.table.columns.status'),
                accessor: (row: HallItem) => getStatusLabel(row.visibilityStatus),
            },
            {
                header: t('halls.table.columns.assigned'),
                accessor: (row: HallItem) => row.itemsCount ?? 0,
            },
            {
                header: t('halls.table.columns.createdAt'),
                accessor: (row: HallItem) => {
                    if (!row.createdAt) return ''
                    const { date, time } = formatDateTime(row.createdAt)
                    return `${date} ${time}`
                },
            },
        ],
        [t],
    )
}
