import { OrderDetails } from '@/api/types/orders'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/utils/formatDateTime'
import StatusPill from '@/components/shared/table/StatusPill'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import { getOrderStatusVariant, getOrderStatusLabel, getPaymentStatusVariant, getPaymentStatusLabel, getOrderTypeLabel } from '../../components/GetStatusLabel'

interface Props {
    data?: OrderDetails
}

const BasicInformation = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date, time } = formatDateTime(data?.createdAt || '')

    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                    <SectionHeader title={t('orders.details.basicInfo')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('orders.table.columns.orderId')}
                            value={data?.id}
                        />
                        <InfoRow
                            label={t('orders.details.type')}
                            value={getOrderTypeLabel(data?.type)}
                        />
                        <InfoRow
                            label={t('orders.table.columns.createdAt')}
                            value={`${date} ${time}`}
                        />
                        <div className="flex flex-col gap-1">
                            <span className="text-primary-500 dark:text-primary-200 font-medium">
                                {t('orders.table.columns.orderStatus')}
                            </span>
                            <div>
                                <StatusPill
                                    variant={getOrderStatusVariant(data?.orderStatus)}
                                    label={getOrderStatusLabel(data?.orderStatus)}
                                    size="sm"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-primary-500 dark:text-primary-200 font-medium">
                                {t('orders.table.columns.paymentStatus')}
                            </span>
                            <div>
                                <StatusPill
                                    variant={getPaymentStatusVariant(data?.paymentStatus)}
                                    label={getPaymentStatusLabel(data?.paymentStatus)}
                                    size="sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default BasicInformation
