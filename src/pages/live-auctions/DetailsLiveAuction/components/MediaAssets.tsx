import SharedMediaAssets from '@/components/shared/cards/MediaAssets'
import { useTranslation } from 'react-i18next'

interface Props {
    media?: string[]
}

const MediaAssets = ({ media }: Props) => {
    const { t } = useTranslation()

    return (
        <SharedMediaAssets
            media={media}
            title={t('liveAuctions.details.mediaAssets')}
        />
    )
}

export default MediaAssets
