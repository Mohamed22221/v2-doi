import SharedSellerInfoCard from '@/components/shared/cards/SellerInfoCard'

interface Props {
    seller?: {
        id: string
        name: string
        phone: string
        status: 'active' | 'inactive'
    }
}

const SellerInfo = ({ seller }: Props) => {
    return <SharedSellerInfoCard seller={seller} />
}

export default SellerInfo
