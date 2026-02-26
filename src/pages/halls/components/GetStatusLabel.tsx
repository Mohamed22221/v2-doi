import { HallVisibilityStatus } from '@/api/types/halls'
type StatusVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral'
import i18n from 'i18next'

export const getStatusLabel = (status: HallVisibilityStatus): string => {
    switch (status) {
        case 'ACTIVE':
            return i18n.t('halls.table.status.active')
        case 'ARCHIVED':
            return i18n.t('halls.table.status.archieved')
        case 'HIDDEN':
            return i18n.t('halls.table.status.hidden')
        case 'DRAFT':
            return i18n.t('halls.table.status.draft')
        default:
            return status
    }
}

export const getStatusVariant = (status: HallVisibilityStatus): StatusVariant => {
    switch (status) {
        case 'ACTIVE':
            return 'success'
        case 'ARCHIVED':
            return 'warning'
        case 'HIDDEN':
            return 'neutral'
        case 'DRAFT':
            return 'info'
        default:
            return 'neutral'
    }
}
