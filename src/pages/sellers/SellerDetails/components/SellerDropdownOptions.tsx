import Dropdown from '@/components/ui/Dropdown'
import {
    HiDotsHorizontal,
    HiOutlinePencil,
    HiOutlineTrash,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineBan,
} from 'react-icons/hi'
import { Button } from '@/components/ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import DeleteUserModal from '@/pages/users/DetailsUser/components/DeleteUserModal'
import SoftDeleteUserModal from '@/pages/users/DetailsUser/components/SoftDeleteUserModal'
import SellerRejectModal from './SellerRejectModal'

export type SellerAction =
    | 'suspend'
    | 'approve_request'
    | 'reject_request'
    | 'update_user'
    | 'temporary_delete'
    | 'permanent_delete'

type PropsDropdown = {
    id: string
    firstName: string
    lastName: string
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
    onAction
}: PropsDropdown) => {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [hardDeleteOpen, setHardDeleteOpen] = useState(false)
    const [softDeleteOpen, setSoftDeleteOpen] = useState(false)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)

    const handleAction = (action: SellerAction) => {
        if (onAction) onAction(action)

        switch (action) {
            case 'update_user':
                navigate(`/users/${id}/edit`)
                break
            case 'reject_request':
                setRejectModalOpen(true)
                break
            case 'temporary_delete':
                setSoftDeleteOpen(true)
                break
            case 'permanent_delete':
                setHardDeleteOpen(true)
                break
            // Other actions would typically be handled by the parent or a mutation hook
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
                <Dropdown.Item
                    eventKey="approve_request"
                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                    onClick={() => handleAction('approve_request')}
                >
                    <HiOutlineCheckCircle />
                    {t('fixedPrice.sellers.status.approveRequest')}
                </Dropdown.Item>

                {/* Reject */}
                <Dropdown.Item
                    eventKey="reject_request"
                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                    onClick={() => handleAction('reject_request')}
                >
                    <HiOutlineXCircle />
                    {t('fixedPrice.sellers.status.rejectRequest')}
                </Dropdown.Item>

                <Dropdown.Item variant="divider" className="my-1" />

                {/* Update */}
                <Dropdown.Item
                    eventKey="update_user"
                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                    onClick={() => handleAction('update_user')}
                >
                    <HiOutlinePencil />
                    {t('fixedPrice.sellers.status.updateUser')}
                </Dropdown.Item>

                <Dropdown.Item variant="divider" className="my-1" />

                {/* Soft Delete */}
                <Dropdown.Item
                    eventKey="temporary_delete"
                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-gray-50"
                    onClick={() => handleAction('temporary_delete')}
                >
                    <HiOutlineTrash />
                    {t('fixedPrice.sellers.status.temporaryDelete')}
                </Dropdown.Item>

                {/* Hard Delete */}
                <Dropdown.Item
                    eventKey="permanent_delete"
                    className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-red-50 text-red-500"
                    onClick={() => handleAction('permanent_delete')}
                >
                    <HiOutlineTrash />
                    {t('fixedPrice.sellers.status.permanentDelete')}
                </Dropdown.Item>
            </Dropdown>

            <DeleteUserModal
                dialogIsOpen={hardDeleteOpen}
                firstName={firstName}
                lastName={lastName}
                onDialogClose={() => setHardDeleteOpen(false)}
                id={id}
            />
            <SoftDeleteUserModal
                dialogIsOpen={softDeleteOpen}
                firstName={firstName}
                lastName={lastName}
                onDialogClose={() => setSoftDeleteOpen(false)}
                id={id}
            />
            <SellerRejectModal
                isOpen={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                id={id}
            />
        </>
    )
}

export default SellerDropdownOptions
