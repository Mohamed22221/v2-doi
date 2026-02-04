import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { useTranslation } from 'react-i18next'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import InfoRow from '@/components/shared/cards/InfoRow'

interface ResolutionCardProps {
    data: {
        outcome: string
        reason: string
    }
}

const ResolutionCard = ({ data }: ResolutionCardProps) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6">
                <SectionHeader title={t('disputes.details.resolution.title')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <InfoRow
                        label={t('disputes.details.resolution.outcome')}
                        value={t(data.outcome)}
                    />
                    <InfoRow
                        label={t('disputes.details.resolution.reason')}
                        value={t(data.reason)}
                    />
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default ResolutionCard
