import { useTranslation } from 'react-i18next'
import { Breadcrumb } from '@/components/ui'
import HallDetailsHeader from './components/HallDetailsHeader'
import AssignedAuctionsTable from './components/AssignedAuctionsTable'
import { HALL_DETAILS_MOCK } from '../data/hall-details.mock'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

const HallDetailsPage = () => {
    const { t } = useTranslation()

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
                onAssignAuctions={() => console.log('Assign Auctions clicked')}
            />
            <BackgroundRounded>
                <AssignedAuctionsTable />
            </BackgroundRounded>
        </div>
    )
}

export default HallDetailsPage
