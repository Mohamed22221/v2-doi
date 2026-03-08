import ImageUpload from '@/components/shared/ImageUpload'

type Props = {
    name?: string
    uploadType?: string
}

const HallImageUpload = ({
    name = 'coverImage',
    uploadType = 'complaint',
}: Props) => {

    return (
        <ImageUpload
            name={name}
            uploadType={uploadType}
            tPrefix="halls"
            crop={true}
            aspectRatio={4 / 3}
        />
    )
}

export default HallImageUpload
