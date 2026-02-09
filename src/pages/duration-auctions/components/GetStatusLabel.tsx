import { LiveAuctionStatus } from "@/api/types/live-auctions"
import { useTranslation } from "react-i18next"

export const getDurationAuctionStatusLabel = (status?: LiveAuctionStatus) => {
    const { t } = useTranslation()
    switch (status) {
        case 'live': return t('durationAuctions.table.status.live')
        case 'scheduled': return t('durationAuctions.table.status.scheduled')
        case 'hidden': return t('durationAuctions.table.status.hidden')
        case 'ended': return t('durationAuctions.table.status.ended')
        case 'rejected': return t('durationAuctions.table.status.rejected')
        default: return status
    }
}

export const getDurationAuctionStatusVariant = (status?: LiveAuctionStatus): "success" | "warning" | "neutral" | "danger" | "info" => {
    switch (status) {
        case 'live': return 'success'
        case 'scheduled': return 'warning'
        case 'hidden': return 'neutral'
        case 'ended': return 'neutral'
        case 'rejected': return 'danger'
        default: return 'neutral'
    }
}
