import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HallItem } from '@/api/types/halls'
import { CsvColumnDef } from '@/utils/csv/csv.utils'
import { formatDateTime } from '@/utils/formatDateTime'

export const useHallsCsvColumns = () => {
    const { t, i18n } = useTranslation()
    const lang = i18n.language

    return useMemo<CsvColumnDef<HallItem>[]>(
        () => [
            {
                header: t('halls.table.columns.hallName'),
                accessor: (row: HallItem) =>
                    lang === 'ar' ? row.nameAr : row.nameEn,
            },
            {
                header: t('halls.table.columns.status'),
                accessor: (row: HallItem) => {
                    const s = row.visibilityStatus
                    switch (s) {
                        case 'ACTIVE':
                            return t('halls.table.status.active')
                        case 'ARCHIVED':
                            return t('halls.table.status.archieved')
                        case 'HIDDEN':
                            return t('halls.table.status.hidden')
                        default:
                            return s ?? ''
                    }
                },
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
        [t, lang],
    )
}
