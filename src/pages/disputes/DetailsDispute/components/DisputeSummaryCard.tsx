import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import InfoRow from '@/components/shared/cards/InfoRow'
import { DisputeItemDetails } from '@/api/types/disputes'

interface DisputeSummaryCardProps {
    data: DisputeItemDetails
}

const DisputeSummaryCard = ({ data }: DisputeSummaryCardProps) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6">
                <SectionHeader title={t('disputes.details.summary.title')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <InfoRow
                        label={t('disputes.details.summary.reason')}
                        value={data.reason}
                    />

                    <InfoRow
                        label={t('disputes.details.summary.requestedOutcome')}
                        value={data.requestedOutcome}
                    />

                    <div className="md:col-span-2">
                        <InfoRow
                            label={t('disputes.details.summary.buyerMessage')}
                            value={data.buyerMessage}
                        />
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default DisputeSummaryCard
