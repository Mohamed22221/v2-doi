import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    HiDotsHorizontal,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineTrash,
} from 'react-icons/hi'

// UI Components
import Dropdown from '@/components/ui/Dropdown'
import { Button } from '@/components/ui'

// Local Components & Modals
import SellerRejectModal from './SellerRejectModal'
import SellerDeleteModal from './modalStatus/SellerDeleteModal'
import SellerApproveModal from './modalStatus/SellerApproveModal'

// Types
import { TApprovalStatus, TAccountStatus } from '@/api/types/sellers'

export type SellerAction =
    | 'approve_request'
    | 'reject_request'
    | 'temporary_delete'
    | 'restore'

type PropsDropdown = {
    id: string
    firstName: string
    lastName: string
    approvalStatus?: TApprovalStatus
    accountStatus?: TAccountStatus
    onAction?: (action: SellerAction) => void
}

/**
 * Dropdown toggle component (Three dots icon)
 */
const Toggle = () => {
    return (
        <Button className="px-[15px] border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-neutral-400">
            <HiDotsHorizontal size={20} />
        </Button>
    )
}

/**
 * Dropdown options for Seller actions
 * Features: Approve, Reject, and Soft Delete actions with associated modals
 */
const SellerDropdownOptions = ({
    id,
    firstName,
    lastName,
    approvalStatus,
    accountStatus,
    onAction
}: PropsDropdown) => {
    const { t } = useTranslation()

    // Modal Visibility State
    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [approveModalOpen, setApproveModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    /**
     * Handles action selection from dropdown or other triggers
     */
    const handleAction = (action: SellerAction) => {
        if (onAction) onAction(action)

        switch (action) {
            case 'reject_request':
                setRejectModalOpen(true)
                break
            case 'approve_request':
                setApproveModalOpen(true)
                break
            case 'temporary_delete':
                setDeleteModalOpen(true)
                break
        }
    }

    return (
        <>
            <Dropdown
                renderTitle={<Toggle />}
                placement="bottom-end"
                menuClass="mt-2 min-w-[200px] p-2"
            >
                {/* Approve Action: Visible if pending or rejected */}
                {(approvalStatus === 'pending' || approvalStatus === 'rejected') && (
                    <Dropdown.Item
                        eventKey="approve_request"
                        className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                        onClick={() => handleAction('approve_request')}
                    >
                        <HiOutlineCheckCircle />
                        {t('sellers.table.status.approveRequest')}
                    </Dropdown.Item>
                )}

                {/* Reject Action: Visible if pending or approved */}
                {(approvalStatus === 'pending' || approvalStatus === 'approved') && (
                    <Dropdown.Item
                        eventKey="reject_request"
                        className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                        onClick={() => handleAction('reject_request')}
                    >
                        <HiOutlineXCircle />
                        {t('sellers.table.status.rejectRequest')}
                    </Dropdown.Item>
                )}

                {/* Soft Delete Action: Visible if not already deleted */}
                {accountStatus !== 'deleted' && (
                    <>
                        <Dropdown.Item variant="divider" className="my-1" />
                        <Dropdown.Item
                            eventKey="temporary_delete"
                            className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                            onClick={() => handleAction('temporary_delete')}
                        >
                            <HiOutlineTrash />
                            {t('sellers.table.actions.softDelete')}
                        </Dropdown.Item>
                    </>
                )}
            </Dropdown>

            {/* Action Modals */}
            <SellerRejectModal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                id={id}
            />
            <SellerDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                id={id}
            />
            <SellerApproveModal
                isOpen={approveModalOpen}
                onClose={() => setApproveModalOpen(false)}
                id={id}
                firstName={firstName}
                lastName={lastName}
            />
        </>
    )
}

export default SellerDropdownOptions
