import { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Components
import { Breadcrumb, Icon } from '@/components/ui'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import BundleItemsTableCard from '@/components/shared/cards/BundleItemsTableCard'
import ErrorState from '@/components/shared/ErrorState'

// Skeletons
import UserInfoSkeleton from '@/components/shared/loaders/UserInfoSkeleton'
import PricingAndDescriptionSkeleton from './components/skeletons/PricingAndDescriptionSkeleton'
import MediaAssetsSkeleton from './components/skeletons/MediaAssetsSkeleton'
import SellerInfoSkeleton from './components/skeletons/SellerInfoSkeleton'
import ActivityLogSkeleton from './components/skeletons/ActivityLogSkeleton'

// Hooks
import { useGetProductById } from '@/api/hooks/products'
import { useGetCategoryById } from '@/api/hooks/categories'
import { useGetSellerDetails } from '@/api/hooks/sellers'

// Lazy Components
const FixedPriceInfo = lazy(() => import('./components/FixedPriceInfo'))
const PricingAndDescription = lazy(
    () => import('./components/PricingAndDescription'),
)
const MediaAssets = lazy(() => import('./components/MediaAssets'))
const SellerInfo = lazy(() => import('./components/SellerInfo'))

/**
 * DetailsFixedPricePage component
 * Main container for fixed-price product details.
 * Fetches product, category, and seller data to display various detail sections.
 */
const DetailsFixedPricePage = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const { product, isError, isLoading, errorMessage } = useGetProductById(id!)
    const { category, isLoading: isLoadingCategory } = useGetCategoryById(product?.categoryId || '', {
        enabled: !!product?.categoryId,
    })

    const { data: sellerData, isLoading: isLoadingSeller } = useGetSellerDetails(product?.userId || '', {
        enabled: !!product?.userId,
    })

    if (isError) {
        return (
            <div>
                <ErrorState message={errorMessage ?? undefined} fullPage={true} />
            </div>
        )
    }

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.fixedPrice'), path: '/fixed-price' },
                    { label: t('fixedPrice.details.title') },
                ]}
            />
            <div className="flex flex-col gap-6">
                <Suspense fallback={<UserInfoSkeleton />}>
                    {isLoading ? (
                        <UserInfoSkeleton />
                    ) : (
                        <FixedPriceInfo data={product} />
                    )}
                </Suspense>

                <Suspense fallback={<PricingAndDescriptionSkeleton />}>
                    {isLoading || isLoadingCategory ? (
                        <PricingAndDescriptionSkeleton />
                    ) : (

                        <PricingAndDescription data={product} category={category} />
                    )}
                </Suspense>

                {/* Bundle Items Table */}
                {!isLoading && product?.isBundle && (
                    <BackgroundRounded>
                        <BundleItemsTableCard
                            isBundle={product?.isBundle || false}
                            bundleItems={product?.bundleItems}
                            currencySymbol={<Icon name="riyal" />}
                        />
                    </BackgroundRounded>


                )}

                <Suspense fallback={<MediaAssetsSkeleton />}>
                    {isLoading ? (
                        <MediaAssetsSkeleton />
                    ) : (
                        <MediaAssets media={product?.images?.map(img => img.url)} />)}
                </Suspense>

                <Suspense fallback={<SellerInfoSkeleton />}>
                    {isLoading || isLoadingSeller ? (
                        <SellerInfoSkeleton />
                    ) : (
                        <SellerInfo
                            seller={
                                sellerData?.data
                                    ? {
                                        id: sellerData?.data?.user?.id,
                                        name: sellerData.data.user
                                            ? `${sellerData.data.user.firstName} ${sellerData.data.user.lastName}`
                                            : '—',
                                        phone:
                                            sellerData.data.user?.phone ||
                                            '—',
                                        approvalStatus:
                                            sellerData.data.approvalStatus,
                                    }
                                    : undefined
                            }
                        />
                    )}
                </Suspense>
            </div>
        </>
    )
}

export default DetailsFixedPricePage


