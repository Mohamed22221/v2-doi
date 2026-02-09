import { useTranslation } from 'react-i18next'
import ImageUpload from '@/components/shared/ImageUpload'

type Props = {
    name?: string
    uploadType?: string
}

const HallImageUpload = ({
    name = 'image',
    uploadType = 'hall',
}: Props) => {
    const { t } = useTranslation()

    return (
        <ImageUpload
            name={name}
            uploadType={uploadType}
            tPrefix="halls"
            crop={true}
            aspectRatio={16 / 9}
        />
    )
}

export default HallImageUpload
