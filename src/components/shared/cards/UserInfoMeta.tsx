import Icon from '@/components/ui/Icon/Icon'
import { useTranslation } from 'react-i18next'
import { icons } from '@/components/ui/Icon/constant'

type TIconName = keyof typeof icons

interface UserInfoMetaProps {
    location?: string
    joinedDate?: string
    locationIcon?: TIconName
    dateIcon?: TIconName
}

const UserInfoMeta = ({
    location,
    joinedDate,
    locationIcon = 'location',
    dateIcon = 'date',
}: UserInfoMetaProps) => {
    const { t } = useTranslation()

    return (
        <div className="mt-2 flex flex-col items-center gap-4 text-sm text-neutral-400 sm:flex-row sm:items-center">
            {location && (
                <span className="flex items-center gap-2">
                    <Icon name={locationIcon} className="text-lg" />
                    {location}
                </span>
            )}
            {joinedDate && (
                <span className="flex items-center gap-2">
                    <Icon name={dateIcon} className="text-lg" />
                    {t('users.userDetails.joined')} {joinedDate}
                </span>
            )}
        </div>
    )
}

export default UserInfoMeta
