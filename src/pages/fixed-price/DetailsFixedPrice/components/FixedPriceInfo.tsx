import { Product } from '@/api/types/products'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import StatusPill from '@/components/shared/table/StatusPill'
import { Button, Notification, toast } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import FixedPriceStatusModal from './modalStatus/FixedPriceStatusModal'
import {
    getStatusLabel,
    getStatusVariant,
} from '../../components/GetStatusLabel'
import ProductApproveModal from './modalStatus/ProductApproveModal'

interface Props {
    data?: Product | null
}

/**
 * FixedPriceInfo Component
 * Displays the header section of the Fixed Price product details page,
 * including the title, status, and action buttons (Approve, Reject, Hide, Unhide).
 */
const FixedPriceInfo = ({ data }: Props) => {
    const { t } = useTranslation()

    // State to manage the status modals (Reject, Hide, Unhide, Approve)
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean
        type: 'reject' | 'hide' | 'unhide' | 'approve'
    }>({
        isOpen: false,
        type: 'reject',
    })

    /**
     * Opens a specific modal based on the action type
     * @param type - The type of modal to open
     */
    const openModal = (type: 'reject' | 'hide' | 'unhide' | 'approve') => {
        setModalConfig({ isOpen: true, type })
    }

    return (
        <BackgroundRounded>
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Product Title and Status Pill */}
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-semibold ">
                            {data?.title}
                        </h2>
                        <StatusPill
                            variant={getStatusVariant(data?.effectiveStatus)}
                            label={getStatusLabel(data?.effectiveStatus, t)}
                            size="sm"
                        />
                    </div>

                    {/* Account/Product ID Info */}
                    <div className="mt-1 flex items-center gap-1">
                        <p className="text-primary-500 dark:text-primary-200 text-sm">
                            {t('users.userDetails.accountId')}:
                        </p>
                        <span className="font-medium text-black dark:text-white text-sm">
                            {data?.id}
                        </span>
                    </div>
                </div>

                {/* Dynamic Action Buttons based on Product Status */}
                <div className="flex gap-3">
                    {/* Actions for Products Pending Approval */}
                    {data?.effectiveStatus === 'pending_approval' && (
                        <>
                            <Button
                                variant="default"
                                size="md"
                                color="red"
                                onClick={() => openModal('reject')}
                            >
                                {t('fixedPrice.details.actions.reject')}
                            </Button>
                            <Button
                                variant="solid"
                                size="md"
                                className="bg-[#2B3467] hover:bg-[#1E254A]"
                                onClick={() => openModal('approve')}
                            >
                                {t('fixedPrice.details.actions.approve')}
                            </Button>
                        </>
                    )}

                    {/* Actions for Active Products */}
                    {data?.effectiveStatus === 'active' && (
                        <Button
                            variant="solid"
                            size="md"
                            color="red"
                            onClick={() => openModal('hide')}
                        >
                            {t('fixedPrice.details.actions.hide')}
                        </Button>
                    )}

                    {/* Actions for Hidden Products */}
                    {data?.effectiveStatus === 'hidden' && (
                        <Button
                            variant="solid"
                            size="md"
                            onClick={() => openModal('unhide')}
                        >
                            {t('fixedPrice.details.actions.unhide')}
                        </Button>
                    )}
                </div>
            </div>

            {/* Status Modals for Reject, Hide, and Unhide actions */}
            <FixedPriceStatusModal
                isOpen={modalConfig.isOpen && modalConfig.type !== 'approve'}
                type={modalConfig.type === 'approve' ? 'reject' : modalConfig.type}
                id={data?.id || ''}
                onClose={() =>
                    setModalConfig({ ...modalConfig, isOpen: false })
                }
            />
            {/* Confirmation Modal for Approval action */}
            <ProductApproveModal
                isOpen={modalConfig.isOpen && modalConfig.type === 'approve'}
                id={data?.id || ''}
                title={data?.title}
                onClose={() =>
                    setModalConfig({ ...modalConfig, isOpen: false })
                }
            />
        </BackgroundRounded>
    )
}

export default FixedPriceInfo
