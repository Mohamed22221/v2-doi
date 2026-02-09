import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Breadcrumb, toast, Notification } from '@/components/ui'
import HallDetailsHeader from './components/HallDetailsHeader'
import AssignedAuctionsTable from './components/AssignedAuctionsTable'
import { HALL_DETAILS_MOCK } from '../data/hall-details.mock'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import AssignLiveAuctionsModal from './components/AssignLiveAuctionsModal'

const HallDetailsPage = () => {
    const { t, i18n } = useTranslation()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const currentLang = i18n.language
    const translation =
        HALL_DETAILS_MOCK.translations.find(
            (tr) => tr.languageCode === currentLang,
        ) || HALL_DETAILS_MOCK.translations[0]

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

    return (
        <div className="flex flex-col gap-4">
            <Breadcrumb
                items={[
                    { label: t('nav.halls'), path: '/halls' },
                    { label: t('halls.details.title') },
                ]}
            />

            <HallDetailsHeader
                hall={HALL_DETAILS_MOCK}
                onAssignAuctions={() => setIsModalOpen(true)}
            />
            <BackgroundRounded>
                <AssignedAuctionsTable />
            </BackgroundRounded>

            <AssignLiveAuctionsModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                hallName={translation?.name || HALL_DETAILS_MOCK.name}
                onAssign={handleAssign}
            />
        </div>
    )
}

export default HallDetailsPage
