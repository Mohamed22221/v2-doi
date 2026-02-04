import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import InfoRow from '@/components/shared/cards/InfoRow'
import { DisputeItemDetails } from '@/api/types/disputes'
import { Link } from 'react-router-dom'

interface BuyerInfoCardProps {
    data: DisputeItemDetails
}

const BuyerInfoCard = ({ data }: BuyerInfoCardProps) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6">
                <SectionHeader title={t('disputes.details.buyerInfo.title')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <InfoRow
                        label={t('disputes.details.buyerInfo.buyerId')}
                        value={
                            <Link
                                to={`/users/${data.buyerDetails.id}`}
                                className="font-semibold text-blue-400 hover:underline"
                            >
                                {data.buyerDetails.id}
                            </Link>
                        }
                    />

                    <InfoRow
                        label={t('disputes.details.buyerInfo.buyerName')}
                        value={data.buyerDetails.name}
                    />

                    <InfoRow
                        label={t('disputes.details.buyerInfo.phoneNumber')}
                        value={data.buyerDetails.phone}
                    />
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default BuyerInfoCard
