import { useGetLiveAuctionDetails } from '../hooks/useGetLiveAuctionDetails'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ErrorState from '@/components/shared/ErrorState'
import UserInfoSkeleton from '@/components/shared/loaders/UserInfoSkeleton'
import InfoCardSkeleton from '@/components/shared/loaders/InfoCardSkeleton'
import ActivityLogSkeleton from '@/components/shared/loaders/ActivityLogSkeleton'

const LiveAuctionInfo = lazy(() => import('./components/LiveAuctionInfo'))
const PricingAndDescription = lazy(
    () => import('./components/PricingAndDescription'),
)
const MediaAssets = lazy(() => import('./components/MediaAssets'))
const SellerInfo = lazy(() => import('./components/SellerInfo'))
const ActivityLog = lazy(() => import('./components/ActivityLog'))

const DetailsLiveAuctionSkeleton = () => (
    <div className="flex flex-col gap-6">
        <InfoCardSkeleton rows={6} />
        <InfoCardSkeleton rows={4} />
        <InfoCardSkeleton rows={4} />
        <ActivityLogSkeleton columns={3} />
    </div>
)

const DetailsLiveAuctionPage = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const { data, isError, isLoading, error } = useGetLiveAuctionDetails(id!)

    if (isError) {
        return <ErrorState message={error?.message} fullPage={true} />
    }

    return (
        <div className="flex flex-col gap-6">
            <Suspense fallback={<UserInfoSkeleton />}>
                {isLoading ? (
                    <UserInfoSkeleton />
                ) : (
                    <LiveAuctionInfo data={data?.data} />
                )}
            </Suspense>

            <Suspense fallback={<DetailsLiveAuctionSkeleton />}>
                {isLoading ? (
                    <DetailsLiveAuctionSkeleton />
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

export default DetailsLiveAuctionPage
