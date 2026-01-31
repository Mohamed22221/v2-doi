import { useTranslation } from 'react-i18next'
import ImageUpload from '@/components/shared/ImageUpload'

type Props = {
    name?: string
    uploadType?: string
}

const CategoryImageUpload = ({
    name = 'image',
    uploadType = 'category',
}: Props) => {
    const { t } = useTranslation()

    return (
        <ImageUpload
            name={name}
            uploadType={uploadType}
            tPrefix="categories"
            crop={true}
            aspectRatio={16 / 9}
        />
    )
}

export default CategoryImageUpload
