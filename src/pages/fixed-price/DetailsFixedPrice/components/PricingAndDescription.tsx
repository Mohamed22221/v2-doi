import { Product } from '@/api/types/products'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import { useGetCategoryById } from '@/api/hooks/categories'

interface Props {
    data?: Product | null
}

const PricingAndDescription = ({ data }: Props) => {
    const { t } = useTranslation()

    // Fetch parent category if it exists
    const { category: parentCategory } = useGetCategoryById(
        data?.category?.parentId || '',
        {
            enabled: !!data?.category?.parentId,
        },
    )

    const getCategoryDisplay = () => {
        if (!data?.category) {
            return (
                t('fixedPrice.details.noCategoryAssigned') ||
                'No category assigned'
            )
        }

        const childName =
            data.category.translations?.[0]?.name || data.category.slug

        if (parentCategory) {
            const parentName =
                parentCategory.translations?.[0]?.name || parentCategory.slug
            return (
                <span className="flex items-center gap-2">
                    <span className="text-gray-500">{parentName}</span>
                    <span className="text-gray-500 rtl:rotate-180">→</span>
                    <span className="font-medium">{childName}</span>
                </span>
            )
        }

        return childName
    }

    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                    <SectionHeader title={t('fixedPrice.details.basicInfo')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <InfoRow
                            label={t('fixedPrice.table.columns.category')}
                            value={getCategoryDisplay()}
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
            </div>
        </BackgroundRounded>
    )
}

export default PricingAndDescription
