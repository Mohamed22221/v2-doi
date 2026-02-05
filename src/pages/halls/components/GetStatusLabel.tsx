import { HallStatus } from '@/api/types/halls'
type StatusVariant = 'success' | 'danger' | 'warning' | 'info' | 'neutral'
import i18n from 'i18next'

export const getStatusLabel = (status: HallStatus): string => {
    switch (status) {
        case 'active':
            return i18n.t('halls.table.status.active')
        case 'achieved':
            return i18n.t('halls.table.status.achieved')
        case 'hidden':
            return i18n.t('halls.table.status.hidden')
        default:
            return status
    }
}

export const getStatusVariant = (status: HallStatus): StatusVariant => {
    switch (status) {
        case 'active':
            return 'success'
        case 'achieved':
            return 'warning'
        case 'hidden':
            return 'neutral'
        default:
            return 'neutral'
    }
}
