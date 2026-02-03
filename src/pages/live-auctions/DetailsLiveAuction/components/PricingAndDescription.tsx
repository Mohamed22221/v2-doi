import { LiveAuctionItemDetails } from '@/api/types/live-auctions'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/utils/formatDateTime'
import { Link } from 'react-router-dom'
import AuctionCounter from './AuctionCounter'
import SectionHeader from '@/components/shared/cards/SectionHeader'

interface Props {
    data?: LiveAuctionItemDetails
}

const PricingAndDescription = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date: startDate, time: startTime } = formatDateTime(data?.startDate || '')
    const { date: endDate, time: endTime } = formatDateTime(data?.endDate || '')

    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                    <SectionHeader title={t('liveAuctions.details.basicInfo')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('liveAuctions.details.category')}
                            value={`${data?.categoryParent} → ${data?.categoryChild}`}
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

                {/* Pricing & Stock */}
                <div>
                    <SectionHeader title={t('liveAuctions.details.pricingAndStock')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('liveAuctions.details.availableQuantity')}
                            value={data?.availableQuantity}
                        />
                        <InfoRow
                            label={t('liveAuctions.details.startingPrice')}
                            value={
                                <span className="flex items-center gap-1 font-semibold text-lg">
                                    {data?.startingPrice.toLocaleString()}
                                    <Icon name="riyal" />
                                </span>
                            }
                        />

                        {/* Status specific data */}
                        {data?.status === 'live' && (
                            <>
                                <InfoRow
                                    label={t('liveAuctions.details.currentHighestBid')}
                                    value={
                                        <span className="flex items-center gap-1 font-semibold text-lg">
                                            {data?.currentHighestBid?.toLocaleString()}
                                            <Icon name="riyal" />
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label={t('liveAuctions.details.timeRemaining')}
                                    value={<AuctionCounter endTime={data?.endDate || ''} />}
                                />
                            </>
                        )}

                        {(data?.status === 'hidden' || data?.status === 'ended') && (
                            <>
                                <InfoRow
                                    label={t('liveAuctions.details.finalPrice')}
                                    value={
                                        <span className="flex items-center gap-1 font-semibold text-lg">
                                            {data?.finalPrice?.toLocaleString()}
                                            <Icon name="riyal" />
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label={t('liveAuctions.details.winner')}
                                    value={
                                        data?.winner ? (
                                            <Link
                                                to={`/users/details/${data.winner.id}`}
                                                className="text-primary hover:underline font-medium"
                                            >
                                                {data.winner.name}
                                            </Link>
                                        ) : '-'
                                    }
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default PricingAndDescription
