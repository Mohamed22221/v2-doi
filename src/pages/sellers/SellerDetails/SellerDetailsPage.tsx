import { Breadcrumb } from '@/components/ui'
import React, { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ErrorState from '@/components/shared/ErrorState'
import UserInfoSkeleton from '@/components/shared/loaders/UserInfoSkeleton'
import InfoCardSkeleton from '@/components/shared/loaders/InfoCardSkeleton'
import { useGetSellerDetails } from '@/api/hooks/sellers'
import { getApiErrorMessage } from '@/api/error'

const SellerInfo = lazy(() => import('./components/SellerInfo'))
const SellerDetailedInfo = lazy(() => import('./components/SellerDetailedInfo'))

const DetailsSellerSkeleton = () => (
    <div className="flex flex-col gap-6">
        <InfoCardSkeleton rows={8} />
    </div>
)

const SellerDetailsPage = () => {
    const { id } = useParams()
    const { t } = useTranslation()

    const { data: response, isLoading, isError, error } = useGetSellerDetails(id!)
    const data = response?.data

    if (isError) {
        return (
            <div>
                <ErrorState message={getApiErrorMessage(error)} fullPage={true} />
            </div>
        )
    }

    if (!data && !isLoading) {
        return <div className="p-4">{t('common.noData')}</div>
    }

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.sellers'), path: '/sellers' },
                    { label: t('sellers.details.title') },
                ]}
            />

            <div className="flex flex-col gap-6">

                <Suspense fallback={<UserInfoSkeleton />}>
                    {isLoading ? (
                        <UserInfoSkeleton />
                    ) : (
                        <SellerInfo data={data!} />
                    )}
                </Suspense>

                <Suspense fallback={<DetailsSellerSkeleton />}>
                    {isLoading ? (
                        <DetailsSellerSkeleton />
                    ) : (
                        <SellerDetailedInfo data={data!} />
                    )}
                </Suspense>
            </div>
        </>
    )
}

export default SellerDetailsPage
