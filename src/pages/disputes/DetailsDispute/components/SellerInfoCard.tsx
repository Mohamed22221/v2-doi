import SellerInfoCard from '@/components/shared/cards/SellerInfoCard'
import { DisputeItemDetails } from '@/api/types/disputes'

interface Props {
    data: DisputeItemDetails
}

const DisputedSellerInfo = ({ data }: Props) => {
    // SharedSellerInfoCard expects seller object in a specific format
    // seller?: {
    //     id: string
    //     name: string
    //     phone: string
    //     status: 'active' | 'inactive'
    // }
    return <SellerInfoCard seller={data.sellerDetails} />
}

export default DisputedSellerInfo
