import { LiveAuctionItemDetails } from '@/api/types/live-auctions'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import StatusPill from '@/components/shared/table/StatusPill'
import { useTranslation } from 'react-i18next'
import { getLiveAuctionStatusLabel, getLiveAuctionStatusVariant } from '../../components/GetStatusLabel'
import Button from '@/components/ui/Button'

interface Props {
    data?: LiveAuctionItemDetails
}

const LiveAuctionInfo = ({ data }: Props) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {data?.name}
                        </h2>
                        <StatusPill
                            variant={getLiveAuctionStatusVariant(data?.status)}
                            label={getLiveAuctionStatusLabel(data?.status)}
                        />
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                        <p className="text-primary-500 dark:text-primary-200 text-sm">
                            {t('users.userDetails.accountId')}:
                        </p>
                        <span className="font-medium text-black dark:text-white text-sm">
                            {data?.id}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="twoTone" color="red-600">
                        {t('liveAuctions.details.actions.reject') || 'Reject'}
                    </Button>
                    <Button variant="solid" color="blue-600">
                        {t('liveAuctions.details.actions.hide') || 'Hide auction'}
                    </Button>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default LiveAuctionInfo
