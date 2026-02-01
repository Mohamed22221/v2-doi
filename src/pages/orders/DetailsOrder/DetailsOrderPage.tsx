import { useGetOrderDetails } from '../hooks/useGetOrderDetails'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ErrorState from '@/components/shared/ErrorState'
import UserInfoSkeleton from '@/components/skeleton/UserInfoSkeleton'
import BasicInformationSkeleton from './components/skeletons/BasicInformationSkeleton'
import PaymentInformationSkeleton from './components/skeletons/PaymentInformationSkeleton'
import BuyerInfoSkeleton from './components/skeletons/BuyerInfoSkeleton'
import SellerInfoSkeleton from './components/skeletons/SellerInfoSkeleton'
import ActivityLogSkeleton from './components/skeletons/ActivityLogSkeleton'

const BasicInformation = lazy(
    () => import('./components/BasicInformation'),
)
const PaymentInformation = lazy(() => import('./components/PaymentInformation'))
const BuyerInfo = lazy(() => import('./components/BuyerInfo'))
const SellerInfo = lazy(() => import('./components/SellerInfo'))
const ActivityLog = lazy(() => import('./components/ActivityLog'))


const DetailsOrderSkeleton = () => (
    <div className="flex flex-col gap-6">
        <BasicInformationSkeleton />
        <PaymentInformationSkeleton />
        <BuyerInfoSkeleton />
        <SellerInfoSkeleton />
        <ActivityLogSkeleton />
    </div>
)

const DetailsOrderPage = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const { data, isError, isLoading, error } = useGetOrderDetails(id!)

    if (isError) {
        return (
            <div>
                <ErrorState message={error?.message} fullPage={true} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6">


            <Suspense fallback={<DetailsOrderSkeleton />}>
                {isLoading ? (
                    <DetailsOrderSkeleton />
                ) : (
                    <>
                        <BasicInformation data={data?.data} />
                        <PaymentInformation data={data?.data} />
                        <BuyerInfo buyer={data?.data?.buyerDetails} />
                        <SellerInfo seller={data?.data?.sellerDetails} />
                        <ActivityLog logs={data?.data?.activityLog} />
                    </>
                )}
            </Suspense>
        </div>
    )
}

export default DetailsOrderPage
