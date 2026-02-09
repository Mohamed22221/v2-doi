import ImageUpload from '@/components/shared/ImageUpload'
import type { TUserPayload } from '@/api/types/users'

type Props = {
    name?: keyof TUserPayload
    title?: string
    subtitle?: string
    uploadType?: string
    size?: number
}

const UserImageUpload = ({
    name = 'image',
    title,
    subtitle,
    uploadType = 'user',
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
            tPrefix="users"
            crop={true}
            aspectRatio={1}
        />
    )
}

export default UserImageUpload
