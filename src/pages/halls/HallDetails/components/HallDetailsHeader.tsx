import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import AccountId from '@/components/shared/cards/AccountId'
import { Button } from '@/components/ui'
import StatusPill from '@/components/shared/table/StatusPill'
import { HallItem, HallItemDetails } from '@/api/types/halls'
import { getStatusLabel, getStatusVariant } from '../../components/GetStatusLabel'

interface HallDetailsHeaderProps {
    hall: HallItemDetails
    onAssignAuctions?: () => void
}

const HallDetailsHeader = ({
    hall,
    onAssignAuctions,
}: HallDetailsHeaderProps) => {
    const { t, i18n } = useTranslation()
    const currentLang = i18n.language

    const name = currentLang === 'ar' ? hall.nameAr : hall.nameEn
    const description = currentLang === 'ar' ? hall.descriptionAr : hall.descriptionEn


    return (
        <BackgroundRounded>
            <div className="flex flex-col gap-4 p-4 sm:px-6 sm:py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {name}
                        </h2>
                        <StatusPill
                            variant={getStatusVariant(hall?.visibilityStatus)}
                            label={getStatusLabel(hall?.visibilityStatus)}
                            size="sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="font-medium text-primary-1000 dark:text-primary-100 text-sm">
                            {hall.id}
                        </span>
                        <span className="text-gray-400">•</span>
                        <p className="text-sm text-black dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Button
                        variant="solid"
                        size="md"
                        color="primary"
                        className="w-full sm:w-auto font-bold px-8 !rounded-xl"
                        onClick={onAssignAuctions}
                    >
                        {t('halls.details.assignLiveAuctions')}
                    </Button>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default HallDetailsHeader
