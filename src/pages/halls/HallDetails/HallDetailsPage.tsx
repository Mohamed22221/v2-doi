import { lazy, Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumb } from '@/components/ui'
import AssignedAuctionsTable from './components/AssignedAuctionsTable'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import AssignLiveAuctionsModal from './components/AssignLiveAuctionsModal'
import HallActionModal from './components/HallActionModal'
import type { HallActionType } from './components/HallActionModal'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetHallById } from '@/api/hooks/halls'
import HallDetailsSkeleton from './components/HallDetailsSkeleton'
import ErrorState from '@/components/shared/ErrorState'

const HallDetailsHeader = lazy(() => import('./components/HallDetailsHeader'))

const HallDetailsPage = () => {
    const { t } = useTranslation()
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [hallActionType, setHallActionType] = useState<HallActionType | null>(
        null,
    )
    const { hall, isLoading, isError, errorMessage } = useGetHallById(id || '')
    const name = hall?.translations?.[0]?.name

    if (isError) {
        return (
            <div>
                <ErrorState
                    message={errorMessage ?? undefined}
                    fullPage={true}
                />
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
                            onSchedule={() => navigate(`/halls/${id}/edit`)}
                            onDelete={() => setHallActionType('delete')}
                        />
                    )
                )}
            </Suspense>
            <BackgroundRounded>
                <AssignedAuctionsTable
                    hallStatus={hall?.visibilityStatus}
                    hallName={name || ''}
                />
            </BackgroundRounded>

            <AssignLiveAuctionsModal
                isOpen={isModalOpen}
                hallName={name || ''}
                hallId={id || ''}
                onOpenChange={setIsModalOpen}
            />

            {hallActionType && (
                <HallActionModal
                    isOpen={!!hallActionType}
                    type={hallActionType}
                    hallId={id || ''}
                    onConfirmSuccess={() => {
                        if (hallActionType === 'delete') {
                            navigate('/halls')
                        }
                    }}
                    onClose={() => setHallActionType(null)}
                />
            )}
        </div>
    )
}

export default HallDetailsPage
