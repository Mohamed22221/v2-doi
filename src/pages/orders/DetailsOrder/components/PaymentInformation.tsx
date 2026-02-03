import { OrderDetails } from '@/api/types/orders'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import SectionHeader from '@/components/shared/cards/SectionHeader'

interface Props {
    data?: OrderDetails
}

const PaymentInformation = ({ data }: Props) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                {/* Payment Information */}
                <div>
                    <SectionHeader title={t('orders.details.paymentInfo')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('orders.details.itemTotalAmount')}
                            value={
                                <span className="flex items-center gap-1">
                                    {data?.itemTotalAmount.toLocaleString()}
                                    <Icon name="riyal" />
                                </span>
                            }
                        />
                        <InfoRow
                            label={t('orders.details.shippingFees')}
                            value={
                                <span className="flex items-center gap-1">
                                    {data?.shippingFees.toLocaleString()}
                                    <Icon name="riyal" />
                                </span>
                            }
                        />
                        <InfoRow
                            label={t('orders.details.totalAmount')}
                            value={
                                <span className="flex items-center gap-1">
                                    {data?.totalAmount.toLocaleString()}
                                    <Icon name="riyal" />
                                </span>
                            }
                        />
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default PaymentInformation
