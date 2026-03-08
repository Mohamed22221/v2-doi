import { HallItemDetails } from '@/api/types/hall-auctions'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/utils/formatDateTime'
import { Link } from 'react-router-dom'
import AuctionCounter from './AuctionCounter'
import SectionHeader from '@/components/shared/cards/SectionHeader'

interface Props {
    data?: HallItemDetails
}

const PricingAndDescription = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date: startDate, time: startTime } = formatDateTime(
        data?.calculatedStartTime || '',
    )
    const { date: endDate, time: endTime } = formatDateTime(
        data?.calculatedEndTime || '',
    )

    const hallName =
        data?.hall?.translations?.[0]?.name ??
        t('common.noDataWithLabel', { name: t('liveAuctions.details.hall') })
    const categoryName =
        data?.product?.category?.name ??
        t('common.noDataWithLabel', {
            name: t('liveAuctions.details.category'),
        })
    const startingPrice = parseFloat(
        data?.product?.auctionStartingPriceIncVat ?? '0',
    )
    const currentHighestBid =
        parseFloat(data?.product?.auctionMinBidIncrement ?? '0') || undefined

    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                    <SectionHeader
                        title={t('liveAuctions.details.basicInfo')}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('liveAuctions.details.category')}
                            value={categoryName}
                        />
                        <InfoRow
                            label={t('liveAuctions.details.hall')}
                            value={hallName}
                        />
                        <InfoRow
                            label={t('common.productCondition')}
                            value={
                                data?.product?.status
                                    ? t(`common.${data.product.status}`)
                                    : t('common.noDataWithLabel', {
                                          name: t('common.productCondition'),
                                      })
                            }
                        />
                        <InfoRow
                            label={t('common.productDefects')}
                            value={
                                data?.product?.defects ||
                                t('common.noDataWithLabel', {
                                    name: t('common.productDefects'),
                                })
                            }
                        />
                        <InfoRow
                            label={t('liveAuctions.details.start')}
                            value={
                                data?.calculatedStartTime
                                    ? `${startDate} – ${startTime}`
                                    : t('common.noDataWithLabel', {
                                          name: t('liveAuctions.details.start'),
                                      })
                            }
                        />
                        <InfoRow
                            label={t('liveAuctions.details.end')}
                            value={
                                data?.calculatedEndTime
                                    ? `${endDate} – ${endTime}`
                                    : t('common.noDataWithLabel', {
                                          name: t('liveAuctions.details.end'),
                                      })
                            }
                        />
                        <div className="col-span-full">
                            <InfoRow
                                label={t('liveAuctions.details.description')}
                                value={
                                    data?.product?.description ??
                                    t('common.noDataWithLabel', {
                                        name: t(
                                            'liveAuctions.details.description',
                                        ),
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}

                <div>
                    <SectionHeader
                        title={t('liveAuctions.details.pricingAndStock')}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('liveAuctions.details.availableQuantity')}
                            value={
                                data?.product?.quantity ??
                                t('common.noDataWithLabel', {
                                    name: t(
                                        'liveAuctions.details.availableQuantity',
                                    ),
                                })
                            }
                        />
                        <InfoRow
                            label={t('liveAuctions.details.startingPrice')}
                            value={
                                <span className="flex items-center gap-1 font-semibold text-lg">
                                    {startingPrice.toLocaleString()}
                                    <Icon name="riyal" />
                                </span>
                            }
                        />

                        {/* Status specific data */}
                        {data?.status === 'ACTIVE' && (
                            <>
                                <InfoRow
                                    label={t(
                                        'liveAuctions.details.currentHighestBid',
                                    )}
                                    value={
                                        <span className="flex items-center gap-1 font-semibold text-lg">
                                            {currentHighestBid?.toLocaleString()}
                                            <Icon name="riyal" />
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label={t(
                                        'liveAuctions.details.timeRemaining',
                                    )}
                                    value={
                                        <AuctionCounter
                                            endTime={
                                                data?.calculatedEndTime || ''
                                            }
                                        />
                                    }
                                />
                            </>
                        )}

                        {(data?.status === 'HIDDEN' ||
                            data?.status === 'ENDED') && (
                            <>
                                <InfoRow
                                    label={t('liveAuctions.details.finalPrice')}
                                    value={
                                        <span className="flex items-center gap-1 font-semibold text-lg">
                                            {currentHighestBid?.toLocaleString() ??
                                                t('common.noDataWithLabel', {
                                                    name: t(
                                                        'liveAuctions.details.finalPrice',
                                                    ),
                                                })}
                                            <Icon name="riyal" />
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label={t('liveAuctions.details.winner')}
                                    value={
                                        data?.winnerUserId ? (
                                            <Link
                                                to={`/users/${data.winnerUserId}`}
                                                className="text-primary hover:underline font-medium"
                                            >
                                                {data.winnerUserId}
                                            </Link>
                                        ) : (
                                            t('common.noDataWithLabel', {
                                                name: t(
                                                    'liveAuctions.details.winner',
                                                ),
                                            })
                                        )
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
