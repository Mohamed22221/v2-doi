import { LiveAuctionStatus } from "@/api/types/live-auctions"
import { useTranslation } from "react-i18next"

export const getLiveAuctionStatusLabel = (status?: LiveAuctionStatus) => {
    const { t } = useTranslation()
    switch (status) {
        case 'live': return t('liveAuctions.table.status.live')
        case 'scheduled': return t('liveAuctions.table.status.scheduled')
        case 'hidden': return t('liveAuctions.table.status.hidden')
        case 'ended': return t('liveAuctions.table.status.ended')
        case 'rejected': return t('liveAuctions.table.status.rejected')
        default: return status
    }
}

export const getLiveAuctionStatusVariant = (status?: LiveAuctionStatus): "success" | "warning" | "neutral" | "danger" | "info" => {
    switch (status) {
        case 'live': return 'success'
        case 'scheduled': return 'warning'
        case 'hidden': return 'neutral'
        case 'ended': return 'neutral'
        case 'rejected': return 'danger'
        default: return 'neutral'
    }
}
