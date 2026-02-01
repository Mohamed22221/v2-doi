import { LiveAuctionItemDetails } from '@/api/types/live-auctions'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/ui'

interface Props {
    data?: LiveAuctionItemDetails
}

const PricingAndStock = ({ data }: Props) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                <div>
                    <h3 className="text-base font-semibold text-neutral-300 mb-5">
                        {t('liveAuctions.details.pricingAndStock')}
                    </h3>
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
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default PricingAndStock
