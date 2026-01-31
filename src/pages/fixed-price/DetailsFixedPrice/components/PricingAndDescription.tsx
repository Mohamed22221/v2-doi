import { FixedPriceItemDetails } from '@/api/types/fixed-price'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'

interface Props {
    data?: FixedPriceItemDetails
}

const PricingAndDescription = ({ data }: Props) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                    <h3 className="text-base font-semibold text-neutral-300 mb-5">
                        {t('fixedPrice.details.basicInfo')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('fixedPrice.table.columns.category')}
                            value={`${data?.categoryParent} → ${data?.categoryChild}`}
                        />
                        <div className="flex flex-col gap-1">
                            <InfoRow
                                label={t('common.description') || 'Description'}
                                value={data?.description}
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div>
                    <h3 className="text-base font-semibold text-neutral-300 mb-5">
                        {t('fixedPrice.details.pricingStock') || 'Pricing & Stock'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('fixedPrice.details.availableQuantity') || 'Available Quantity'}
                            value={data?.availableQuantity}
                        />
                        <InfoRow
                            label={t('fixedPrice.details.price') || 'Price'}
                            value={
                                <span className="flex items-center gap-1">
                                    {data?.price.toLocaleString()}
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

export default PricingAndDescription
