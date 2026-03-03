import SharedSellerInfoCard from '@/components/shared/cards/SellerInfoCard'
import { TApprovalStatus } from '@/api/types/sellers'

interface Props {
    seller?: {
        id: string
        name: string
        phone: string
        approvalStatus: TApprovalStatus
    }
}

const SellerInfo = ({ seller }: Props) => {
    return <SharedSellerInfoCard seller={seller} />
}

export default SellerInfo
