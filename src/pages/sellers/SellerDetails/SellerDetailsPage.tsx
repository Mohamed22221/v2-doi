import React, { lazy, Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// UI Components
import { Breadcrumb } from '@/components/ui'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import ErrorState from '@/components/shared/ErrorState'

// Skeletons & Loaders
import UserInfoSkeleton from '@/components/shared/loaders/UserInfoSkeleton'
import InfoCardSkeleton from '@/components/shared/loaders/InfoCardSkeleton'
import DocumentsSectionSkeleton from '@/components/shared/loaders/DocumentsSectionSkeleton'

// API & Utilities
import { useGetSellerDetails } from '@/api/hooks/sellers'
import { getApiErrorMessage } from '@/api/error'

// Lazy loaded components for better performance
const SellerInfo = lazy(() => import('./components/SellerInfo'))
const SellerDetailedInfo = lazy(() => import('./components/SellerDetailedInfo'))

/**
 * Skeleton component for the detailed information section
 */
const DetailsSellerSkeleton = () => (
    <div className="flex flex-col gap-6">
        <InfoCardSkeleton rows={8} />
        <BackgroundRounded>
            <DocumentsSectionSkeleton />
        </BackgroundRounded>
    </div>
)

const SellerDetailsPage = () => {
    const { id } = useParams()
    const { t } = useTranslation()

    // Fetch seller details based on ID from URL
    const { data: response, isLoading, isError, error } = useGetSellerDetails(id!)
    const data = response?.data

    // Error state handling
    if (isError) {
        return (
            <div>
                <ErrorState message={getApiErrorMessage(error)} fullPage={true} />
            </div>
        )
    }

    // No data state handling
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
                {/* Main Seller Info (Avatar, Name, Status) */}
                <Suspense fallback={<UserInfoSkeleton />}>
                    {isLoading ? (
                        <UserInfoSkeleton />
                    ) : (
                        <SellerInfo data={data!} />
                    )}
                </Suspense>

                {/* Detailed Information (Personal, Business, Documents) */}
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
