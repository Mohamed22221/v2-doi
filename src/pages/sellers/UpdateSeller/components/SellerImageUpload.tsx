import ImageUpload from '@/components/shared/ImageUpload'
import type { TSellerPayload } from '../../hooks/useUpdateSeller'

type Props = {
    name?: keyof TSellerPayload
    title?: string
    subtitle?: string
    uploadType?: string
    size?: number
}

const SellerImageUpload = ({
    name = 'image',
    title,
    subtitle,
    uploadType = 'user_profile',
    size = 96,
}: Props) => {

    return (
        <ImageUpload
            name={name}
            uploadType={uploadType}
            variant="avatar"
            label={title}
            description={subtitle}
            size={size}
            tPrefix="sellers"
            crop={true}
            aspectRatio={1}
        />
    )
}

export default SellerImageUpload
