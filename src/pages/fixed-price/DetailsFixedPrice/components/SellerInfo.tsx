import { useTranslation } from 'react-i18next'

// Components
import SharedSellerInfoCard from '@/components/shared/cards/SellerInfoCard'

// Types
import { TApprovalStatus } from '@/api/types/sellers'

interface Props {
    seller?: {
        id: string
        name: string
        phone: string
        approvalStatus: TApprovalStatus
    }
}

/**
 * SellerInfo component
 * Wrapper for SharedSellerInfoCard used in the Fixed Price detail page.
 * Handles loading/empty states for seller details.
 */
const SellerInfo = ({ seller }: Props) => {
    const { t } = useTranslation()

    if (!seller) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                    {t('common.noDataFound') || 'لم يتم العثور علي بيانات'}
                </p>
            </div>
        )
    }

    return <SharedSellerInfoCard seller={seller} />
}

export default SellerInfo
