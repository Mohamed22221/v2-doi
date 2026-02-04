import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Breadcrumb, Skeleton } from '@/components/ui'
import { useGetDisputeDetails } from '../hooks/useGetDisputeDetails'
import { lazy, Suspense, useState } from 'react'
import InfoCardSkeleton from '@/components/shared/loaders/InfoCardSkeleton'
import ActivityLogSkeleton from '@/components/shared/loaders/ActivityLogSkeleton'
import ErrorState from '@/components/shared/ErrorState'
import { Button } from '@/components/ui'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import AccountId from '@/components/shared/cards/AccountId'
import DetailsDisputeSkeleton from './components/DetailsDisputeSkeleton'

// Lazy loaded components
const DisputeHeader = lazy(() => import('./components/DisputeHeader'))
const OverviewCard = lazy(() => import('./components/OverviewCard'))
const DisputeSummaryCard = lazy(() => import('./components/DisputeSummaryCard'))
const OrderSnapshotCard = lazy(() => import('./components/OrderSnapshotCard'))
const BuyerInfoCard = lazy(() => import('./components/BuyerInfoCard'))
const SellerInfoCard = lazy(() => import('./components/SellerInfoCard'))
const ActivityLogCard = lazy(() => import('./components/ActivityLogCard'))
const ResolveDisputeModal = lazy(() => import('./components/modals/ResolveDisputeModal/ResolveDisputeModal'))
const RequestEvidenceModal = lazy(() => import('./components/modals/RequestEvidenceModal/RequestEvidenceModal'))



const DetailsDisputePage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const { data: dispute, isError, isLoading, refetch } = useGetDisputeDetails(id || '')

    // Modal states
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false)

    if (isError) {
        return <ErrorState message={t('disputes.details.errors.disputeNotFound')} fullPage={true} />
    }

    const handleExport = () => {
        console.log('Exporting case...')
        // Implement export logic
    }

    // HeaderActions removed as it's now internal to DisputeHeader

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.disputes'), path: '/disputes' },
                    { label: t('disputes.details.breadcrumb') },
                ]}
            />

            <div className="flex flex-col gap-6">
                <Suspense fallback={<DetailsDisputeSkeleton />}>
                    {isLoading || !dispute ? (
                        <DetailsDisputeSkeleton />
                    ) : (
                        <>
                            <DisputeHeader
                                id={id || ''}
                                onExport={handleExport}
                                onResolve={() => setIsResolveModalOpen(true)}
                                onRequestEvidence={() => setIsEvidenceModalOpen(true)} />
                            <OverviewCard data={dispute} />
                            <DisputeSummaryCard data={dispute} />
                            <OrderSnapshotCard data={dispute} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <BuyerInfoCard data={dispute} />
                                <SellerInfoCard data={dispute} />
                            </div>
                            <ActivityLogCard data={dispute} />
                        </>
                    )}
                </Suspense>
            </div>

            <Suspense fallback={null}>
                <ResolveDisputeModal
                    isOpen={isResolveModalOpen}
                    onClose={() => setIsResolveModalOpen(false)}
                    onConfirmSuccess={refetch}
                />
                <RequestEvidenceModal
                    isOpen={isEvidenceModalOpen}
                    onClose={() => setIsEvidenceModalOpen(false)}
                    onConfirmSuccess={refetch}
                />
            </Suspense>
        </>
    )
}

export default DetailsDisputePage
