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
        case 'ENDED':
            return i18n.t('halls.table.status.ended')
        case 'SCHEDULED':
            return i18n.t('halls.table.status.scheduled')
        default:
            return status
    }
}

export const getStatusVariant = (status: HallVisibilityStatus): StatusVariant => {
    switch (status) {
        case 'ACTIVE':
            return 'success'
        case 'ARCHIVED':
        case 'SCHEDULED':
            return 'warning'
        case 'HIDDEN':
        case 'DRAFT':
            return 'neutral'
        case 'ENDED':
            return 'danger'
        default:
            return 'neutral'
    }
}
