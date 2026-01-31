import { useTranslation } from 'react-i18next'
import ImageUpload from '@/components/shared/ImageUpload'

type Props = {
    name?: string
    uploadType?: string
}

const BrandLogoUpload = ({
    name = 'logoUrl',
    uploadType = 'brand',
}: Props) => {
    const { t } = useTranslation()

    return (
        <ImageUpload
            name={name}
            uploadType={uploadType}
            // label={t('brands.logo')}
            tPrefix="brands"
            crop={true}
            aspectRatio={16 / 9}
        />
    )
}

export default BrandLogoUpload
