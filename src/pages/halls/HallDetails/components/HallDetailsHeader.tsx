import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { Button, Icon } from '@/components/ui'
import StatusPill from '@/components/shared/table/StatusPill'
import { HallItemDetails } from '@/api/types/halls'
import { getStatusLabel, getStatusVariant } from '../../components/GetStatusLabel'

interface HallDetailsHeaderProps {
    hall: HallItemDetails
    onAssignAuctions?: () => void
    onSchedule?: () => void
    onDelete?: () => void
}

const HallDetailsHeader = ({
    hall,
    onAssignAuctions,
    onSchedule,
    onDelete,
}: HallDetailsHeaderProps) => {
    const { t } = useTranslation()
    const name = hall.translations?.[0]?.name
    const description = hall.translations?.[0]?.description


    return (
        <BackgroundRounded>
            <div className="flex flex-col md:flex-row md:mx-4 items-center gap-1">
                <div className="w-[250px] h-[200px] md:w-[250px] md:h-[200px] rounded-[10px] sm:rounded-[12px] overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                    {hall?.coverImage ? (
                        <img
                            src={hall.coverImage}
                            alt={name ?? ''}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Icon name="assets" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4 p-4 md:gap-2 sm:px-6 sm:py-3">

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
                          {t('users.table.columns.idPrefix')}  {hall.id}
                        </span>
                        {description && description.length < 30 && <span className="text-gray-400">•</span>}
                        {description && <p className="text-sm text-black dark:text-gray-400">
                            {description}
                        </p>}
                    </div>
           
                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:gap-3">
                        
                        {hall.visibilityStatus === 'DRAFT' ? (
                            <>
                                <Button
                                    variant="solid"
                                    size="md"
                                    color="primary"
                                    className="w-full sm:w-auto font-bold px-8 !rounded-xl"
                                    onClick={onSchedule}
                                >
                                    {t('halls.details.scheduleHall') || 'Schedule Hall'}
                                </Button>
                                <Button
                                    variant="default"
                                    size="md"
                                    color="red"
                                    className="w-full sm:w-auto font-bold px-8 !rounded-xl"
                                    onClick={onDelete}
                                >
                                    {t('halls.details.deleteHall') || 'Delete Hall'}
                                </Button>
                            </>
                        ) : hall.visibilityStatus !== 'ENDED' ? (
                            <Button
                                variant="solid"
                                size="md"
                                color="primary"
                                className="w-full sm:w-auto font-bold px-8 !rounded-xl"
                                onClick={onAssignAuctions}
                            >
                                {t('halls.details.assignLiveAuctions')}
                            </Button>
                        ) : (
                                null
                        )}
                    </div>


                </div>
                
            </div>

        </BackgroundRounded>
    )
}

export default HallDetailsHeader
