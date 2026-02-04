import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import InfoRow from '@/components/shared/cards/InfoRow'
import AccountId from '@/components/shared/cards/AccountId'
import StatusPill from '@/components/shared/table/StatusPill'
import { getStatusLabel, getStatusVariant } from '../../components/GetStatusLabel'
import { DisputeItemDetails } from '@/api/types/disputes'
import SLACounter from './SLACounter'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@/components/ui'

interface OverviewCardProps {
    data: DisputeItemDetails
}

const OverviewCard = ({ data }: OverviewCardProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const orderTypeLabels = {
        'live-auction': t('disputes.details.overview.orderTypes.liveAuction'),
        'fixed-price': t('disputes.details.overview.orderTypes.fixedPrice'),
        'duration-auction': t('disputes.details.overview.orderTypes.durationAuction')
    }

    return (
        <BackgroundRounded>
            <div className="p-6">
                <SectionHeader title={t('disputes.details.overview.title')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {/* Left Column */}
                    <div className="flex flex-col gap-4">
                        <InfoRow
                            label={t('disputes.details.overview.disputeId')}
                            value={<span className="font-semibold text-gray-900 dark:text-gray-100 ">{data.id}</span>}
                        />

                        <InfoRow
                            label={t('disputes.details.overview.orderType')}
                            value={orderTypeLabels[data.orderType]}
                        />

                        <InfoRow
                            label={t('disputes.details.overview.disputeStatus')}
                            value={
                                <StatusPill
                                    variant={getStatusVariant(data.status)}
                                    label={getStatusLabel(data.status)}
                                    size="sm"
                                />
                            }
                        />
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col gap-4">
                        <InfoRow
                            label={t('disputes.details.overview.orderId')}
                            value={
                                <Link
                                    to={`/orders/${data.orderId}`}
                                    className="font-semibold text-blue-400 hover:underline text-left underline"
                                >
                                    {data.orderId}
                                </Link>
                            }
                        />

                        <InfoRow
                            label={t('disputes.details.overview.heldAmount')}
                            value={<span className="flex items-center gap-1 font-semibold text-lg">
                                {data?.heldAmount.toLocaleString()}
                                <Icon name="riyal" />
                            </span>}


                        />

                        <InfoRow
                            label={t('disputes.details.overview.slaCounter')}
                            value={
                                <SLACounter
                                    days={data.slaCounter.days}
                                    hours={data.slaCounter.hours}
                                    minutes={data.slaCounter.minutes}
                                />
                            }
                        />
                    </div>
                </div>

                {data.status !== 'waiting-seller-response' && (
                    <>

                        <div className="my-3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                            {data.resolution?.resolvedAt && (
                                <InfoRow
                                    label={t('disputes.details.resolution.resolvedAt')}
                                    value={data.resolution.resolvedAt}
                                />
                            )}
                            {data.resolution?.resolvedBy && (
                                <InfoRow
                                    label={t('disputes.details.resolution.resolvedBy')}
                                    value={data.resolution.resolvedBy}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </BackgroundRounded>
    )
}

export default OverviewCard
