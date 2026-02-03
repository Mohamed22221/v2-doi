import { LiveAuctionItemDetails } from '@/api/types/live-auctions'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/utils/formatDateTime'
import SectionHeader from '@/components/shared/cards/SectionHeader'

interface Props {
    data?: LiveAuctionItemDetails
}

const BasicInformation = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date: startDate, time: startTime } = formatDateTime(data?.startDate || '')
    const { date: endDate, time: endTime } = formatDateTime(data?.endDate || '')

    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                <div>
                    <SectionHeader title={t('liveAuctions.details.basicInfo')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('liveAuctions.details.category')}
                            value={`${data?.categoryParent} + ${data?.categoryChild}`}
                        />
                        <InfoRow
                            label={t('liveAuctions.details.hall')}
                            value={data?.hall}
                        />
                        <InfoRow
                            label={t('liveAuctions.details.start')}
                            value={`${startDate} – ${startTime}`}
                        />
                        <InfoRow
                            label={t('liveAuctions.details.end')}
                            value={`${endDate} – ${endTime}`}
                        />
                        <div className="col-span-full">
                            <InfoRow
                                label={t('liveAuctions.details.description')}
                                value={data?.description}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default BasicInformation
