import { useTranslation } from 'react-i18next'

// Components
import { Icon } from '@/components/ui'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import { CategoryBreadcrumb } from '@/components/helpers/CategoryBreadcrumb'

// Types
import { Product } from '@/api/types/products'

interface Props {
    data?: Product | null
}

const PricingAndDescription = ({ data }: Props) => {
    const { t } = useTranslation()

    // Fetch parent category if it exists

    const DataCategoryIsBundel = () => {
        return (
            <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                    <SectionHeader title={t('fixedPrice.details.basicInfo')} />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5'>
                        <InfoRow
                            label={t('fixedPrice.table.columns.category')}
                            value={<CategoryBreadcrumb category={data?.category} />}
                        />
                        <InfoRow
                            label={t('common.description') || 'Description'}
                            value={data?.description}
                        />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <BackgroundRounded>
            {data?.isBundle ? <DataCategoryIsBundel /> : <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                    <SectionHeader title={t('fixedPrice.details.basicInfo')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('fixedPrice.table.columns.category')}
                            value={<CategoryBreadcrumb category={data?.category} />}
                        />
                        <InfoRow
                            label={t('fixedPrice.details.productCondition')}
                            value={
                                data?.status
                                    ? t(
                                        `fixedPrice.details.condition.${data.status}`,
                                    )
                                    : '-'
                            }
                        />
                        <InfoRow
                            label={t('common.description') || 'Description'}
                            value={data?.description}
                        />
                        <InfoRow
                            label={t('fixedPrice.details.productDefects')}
                            value={data?.defects || '-'}
                        />
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div>
                    <SectionHeader
                        title={
                            t('fixedPrice.details.pricingStock') ||
                            'Pricing & Stock'
                        }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={
                                t('fixedPrice.details.availableQuantity') ||
                                'Available Quantity'
                            }
                            value={data?.quantity}
                        />
                        <InfoRow
                            label={t('fixedPrice.details.price') || 'Price'}
                            value={
                                data?.price ? (
                                    <span className="flex items-center gap-1">
                                        {data.price.toLocaleString()}
                                        <Icon name="riyal" />
                                    </span>
                                ) : (
                                    '-'
                                )
                            }
                        />
                    </div>
                </div>
            </div>}

        </BackgroundRounded>
    )
}

export default PricingAndDescription
