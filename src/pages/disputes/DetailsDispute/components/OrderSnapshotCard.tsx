import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import InfoRow from '@/components/shared/cards/InfoRow'
import { DisputeItemDetails } from '@/api/types/disputes'
import { Icon } from '@/components/ui'

interface OrderSnapshotCardProps {
    data: DisputeItemDetails
}

const OrderSnapshotCard = ({ data }: OrderSnapshotCardProps) => {
    const { t } = useTranslation()

    const CurrencyValue = ({ value }: { value: number }) => (
        <span className="flex items-center gap-1 font-semibold text-lg">
            {value.toLocaleString()}
            <Icon name="riyal" />
        </span>
    )

    return (
        <BackgroundRounded>
            <div className="p-6">
                <SectionHeader title={t('disputes.details.orderSnapshot.title')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <InfoRow
                        label={t('disputes.details.orderSnapshot.itemTotalAmount')}
                        value={<CurrencyValue value={data.orderSnapshot.itemTotalAmount} />}
                    />

                    <InfoRow
                        label={t('disputes.details.orderSnapshot.vat')}
                        value={<CurrencyValue value={data.orderSnapshot.vat} />}
                    />

                    <InfoRow
                        label={t('disputes.details.orderSnapshot.shippingFees')}
                        value={<CurrencyValue value={data.orderSnapshot.shippingFees} />}
                    />

                    <InfoRow
                        label={t('disputes.details.orderSnapshot.totalAmount')}
                        value={<CurrencyValue value={data.orderSnapshot.totalAmount} />}
                    />
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default OrderSnapshotCard
