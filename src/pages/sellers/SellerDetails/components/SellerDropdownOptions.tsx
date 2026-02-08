import Dropdown from '@/components/ui/Dropdown'
import {
    HiDotsHorizontal,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineTrash,
} from 'react-icons/hi'
import { Button } from '@/components/ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SellerRejectModal from './SellerRejectModal'
import SellerActivateModal from './modalStatus/SellerActivateModal'
import SellerDeleteModal from './modalStatus/SellerDeleteModal'
import SellerApproveModal from './modalStatus/SellerApproveModal'


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

const Toggle = () => {
    return (
        <Button className="px-[15px] border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-neutral-400">
            <HiDotsHorizontal size={20} />
        </Button>
    )
}

const SellerDropdownOptions = ({
    id,
    firstName,
    lastName,
    approvalStatus,
    accountStatus,
    onAction
}: PropsDropdown) => {
    const { t } = useTranslation()

    const [rejectModalOpen, setRejectModalOpen] = useState(false)
    const [approveModalOpen, setApproveModalOpen] = useState(false)
    const [activateModalOpen, setActivateModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

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
                {/* Approve */}
                {(approvalStatus === 'pending' || approvalStatus === 'rejected') && (
                    <Dropdown.Item
                        eventKey="approve_request"
                        className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                        onClick={() => handleAction('approve_request')}
                    >
                        <HiOutlineCheckCircle />
                        {t('fixedPrice.sellers.status.approveRequest')}
                    </Dropdown.Item>
                )}

                {/* Reject */}
                {(approvalStatus === 'pending' || approvalStatus === 'approved') && (
                    <Dropdown.Item
                        eventKey="reject_request"
                        className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                        onClick={() => handleAction('reject_request')}
                    >
                        <HiOutlineXCircle />
                        {t('fixedPrice.sellers.status.rejectRequest')}
                    </Dropdown.Item>
                )}

                {/* Soft Delete */}
                {accountStatus !== 'deleted' && (
                    <>
                        <Dropdown.Item variant="divider" className="my-1" />
                        <Dropdown.Item
                            eventKey="temporary_delete"
                            className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                            onClick={() => handleAction('temporary_delete')}
                        >
                            <HiOutlineTrash />
                            {t('fixedPrice.sellers.status.temporaryDelete')}
                        </Dropdown.Item>
                    </>

                )}
            </Dropdown>

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
