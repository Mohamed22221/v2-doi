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
            maxWidth="100%"
            maxHeight="400px"
        />
    )
}

export default HallImageUpload
