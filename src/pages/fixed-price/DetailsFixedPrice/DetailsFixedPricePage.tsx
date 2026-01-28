import { useGetFixedPriceDetails } from '../hooks/useGetFixedPriceDetails'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ErrorState from '@/components/shared/ErrorState'
import UserInfoSkeleton from '@/components/skeleton/UserInfoSkeleton' // Adapting user skeleton

const FixedPriceInfo = lazy(() => import('./components/FixedPriceInfo'))
const PricingAndDescription = lazy(
    () => import('./components/PricingAndDescription'),
)
const MediaAssets = lazy(() => import('./components/MediaAssets'))
const SellerInfo = lazy(() => import('./components/SellerInfo'))
const ActivityLog = lazy(() => import('./components/ActivityLog'))

// Skeleton imports
const PricingAndDescriptionSkeleton = lazy(
    () => import('./components/skeletons/PricingAndDescriptionSkeleton'),
)
const MediaAssetsSkeleton = lazy(
    () => import('./components/skeletons/MediaAssetsSkeleton'),
)
const SellerInfoSkeleton = lazy(
    () => import('./components/skeletons/SellerInfoSkeleton'),
)
const ActivityLogSkeleton = lazy(
    () => import('./components/skeletons/ActivityLogSkeleton'),
)

const DetailsFixedPriceSkeleton = () => (
    <div className="flex flex-col gap-6">
        <PricingAndDescriptionSkeleton />
        <MediaAssetsSkeleton />
        <SellerInfoSkeleton />
        <ActivityLogSkeleton />
    </div>
)

const DetailsFixedPricePage = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const { data, isError, isLoading, error } = useGetFixedPriceDetails(id!)

    if (isError) {
        return (
            <div>
                <ErrorState message={error?.message} fullPage={true} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <Suspense fallback={<UserInfoSkeleton />}>
                {isLoading ? (
                    <UserInfoSkeleton />
                ) : (
                    <FixedPriceInfo data={data?.data} />
                )}
            </Suspense>

            <Suspense fallback={<DetailsFixedPriceSkeleton />}>
                {isLoading ? (
                    <DetailsFixedPriceSkeleton />
                ) : (
                    <>
                        <PricingAndDescription data={data?.data} />
                        <MediaAssets media={data?.data?.mediaAssets} />
                        <SellerInfo seller={data?.data?.sellerDetails} />
                        <ActivityLog logs={data?.data?.activityLog} />
                    </>
                )}
            </Suspense>
        </div>
    )
}

export default DetailsFixedPricePage
