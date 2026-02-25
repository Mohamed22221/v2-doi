import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumb, toast, Notification } from '@/components/ui'
import AssignedAuctionsTable from './components/AssignedAuctionsTable'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import AssignLiveAuctionsModal from './components/AssignLiveAuctionsModal'
import { useParams } from 'react-router-dom'
import { useGetHallById } from '@/api/hooks/halls'
import { Skeleton } from '@/components/ui'
import HallDetailsSkeleton from './components/HallDetailsSkeleton'
import ErrorState from '@/components/shared/ErrorState'

const HallDetailsHeader = lazy(() => import('./components/HallDetailsHeader'))

const HallDetailsPage = () => {
    const { t, i18n } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const currentLang = i18n.language

    const { hall, isLoading, isError, errorMessage } = useGetHallById(id || "")
    const name = currentLang === 'ar' ? hall?.nameAr : hall?.nameEn

    const handleAssign = (selectedIds: string[]) => {
        console.log('Assigned IDs:', selectedIds)
        toast.push(
            <Notification
                title={t('common.success') || 'Success'}
                type="success"
            >
                {selectedIds.length} auctions have been assigned successfully.
            </Notification>,
        )
    }



    if (isError) {
        return (
            <div>
                <ErrorState message={errorMessage ?? undefined} fullPage={true} />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            <Breadcrumb
                items={[
                    { label: t('nav.halls'), path: '/halls' },
                    { label: t('halls.details.title') },
                ]}
            />
            <Suspense fallback={<HallDetailsSkeleton />}>
                {isLoading ? (
                    <HallDetailsSkeleton />
                ) : (
                    hall && (
                        <HallDetailsHeader
                            hall={hall}
                            onAssignAuctions={() => setIsModalOpen(true)}
                        />
                    )
                )}
            </Suspense>
            <BackgroundRounded>
                <AssignedAuctionsTable />
            </BackgroundRounded>

            <AssignLiveAuctionsModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                hallName={name || hall?.nameEn || ""}
                onAssign={handleAssign}
            />
        </div>
    )
}

export default HallDetailsPage
