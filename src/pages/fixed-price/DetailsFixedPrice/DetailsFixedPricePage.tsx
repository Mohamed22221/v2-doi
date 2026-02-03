import { Breadcrumb } from '@/components/ui'
import { useGetFixedPriceDetails } from '../hooks/useGetFixedPriceDetails'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ErrorState from '@/components/shared/ErrorState'
import UserInfoSkeleton from '@/components/shared/loaders/UserInfoSkeleton' // Adapting user skeleton
import PricingAndDescriptionSkeleton from './components/skeletons/PricingAndDescriptionSkeleton'
import MediaAssetsSkeleton from './components/skeletons/MediaAssetsSkeleton'
import SellerInfoSkeleton from './components/skeletons/SellerInfoSkeleton'
import ActivityLogSkeleton from './components/skeletons/ActivityLogSkeleton'

const FixedPriceInfo = lazy(() => import('./components/FixedPriceInfo'))
const PricingAndDescription = lazy(
    () => import('./components/PricingAndDescription'),
)
const MediaAssets = lazy(() => import('./components/MediaAssets'))
const SellerInfo = lazy(() => import('./components/SellerInfo'))
const ActivityLog = lazy(() => import('./components/ActivityLog'))


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
        </>
    )
}

export default DetailsFixedPricePage
