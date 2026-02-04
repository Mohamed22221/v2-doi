import { DisputeStatus } from "@/api/types/disputes"
import { useTranslation } from "react-i18next"

export const getStatusLabel = (status?: DisputeStatus) => {
    const { t } = useTranslation()
    switch (status) {
        case 'resolved-buyer': return t('disputes.table.status.resolvedBuyer')
        case 'resolved-seller': return t('disputes.table.status.resolvedSeller')
        case 'resolved-compromise': return t('disputes.table.status.resolvedCompromise')
        case 'waiting-seller-response': return t('disputes.table.status.waitingSeller')
        case 'dispute-opened': return t('disputes.table.status.disputeOpened')
        case 'platform-mediation': return t('disputes.table.status.platformMediation')
        default: return status
    }
}

export const getStatusVariant = (status?: DisputeStatus) => {
    switch (status) {
        case 'resolved-buyer': return 'success'
        case 'resolved-seller': return 'success'
        case 'resolved-compromise': return 'success'
        case 'waiting-seller-response': return 'warning'
        case 'dispute-opened': return 'neutral'
        case 'platform-mediation': return 'warning'
        default: return 'neutral'
    }
}
