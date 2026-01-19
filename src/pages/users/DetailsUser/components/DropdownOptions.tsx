import Dropdown from '@/components/ui/Dropdown'
import {
    HiDotsHorizontal,
    HiOutlinePencil,
    HiOutlineTrash,
} from 'react-icons/hi'
import { Button } from '@/components/ui'
import { useState } from 'react'
import DeleteUserModal from './DeleteUserModal'
import { useTranslation } from 'react-i18next'
import SoftDeleteUserModal from './SoftDeleteUserModal'
import { useNavigate } from 'react-router-dom'

type PropsDropdown = {
    id: string | number
    firstName: string
    lastName: string
    isDeleted?: boolean
}
const Toggle = () => {
    return (
        <Button className="px-[15px]">
            <HiDotsHorizontal />
        </Button>
    )
}
const DropdownOptions = ({
    id,
    firstName,
    lastName,
    isDeleted,
}: PropsDropdown) => {
    const navigate = useNavigate()

    const [dialogIsOpen, setIsOpen] = useState(false)
    const [softDialogIsOpen, setIsSotfOpen] = useState(false)

    const { t } = useTranslation()

    const openHardDelete = () => {
        setIsOpen(true)
    }

    const closeHardDelete = () => {
        setIsOpen(false)
    }
    const openSoftDelete = () => {
        setIsSotfOpen(true)
    }

    const closeSoftDelete = () => {
        setIsSotfOpen(false)
    }

    return (
        <>
            <Dropdown
                renderTitle={<Toggle />}
                placement="bottom-end"
                menuClass="mt-3"
            >
                {/* Edit */}
                <Dropdown.Item
                    eventKey="edit"
                    onClick={() => navigate(`/users/${id}/edit `)}
                >
                    <HiOutlinePencil />
                    {t('users.update.submitUpdate')}
                </Dropdown.Item>

                <Dropdown.Item variant="divider" />

                {/* Soft delete */}
                {isDeleted === true && (
                    <>
                        <Dropdown.Item eventKey="soft" onClick={openSoftDelete}>
                            <HiOutlineTrash />
                            {t('users.table.actions.softDelete')}
                        </Dropdown.Item>

                        <Dropdown.Item variant="divider" />
                    </>
                )}

                {/* Hard delete */}
                <Dropdown.Item
                    eventKey="hard"
                    className="text-red-500"
                    onClick={openHardDelete}
                >
                    <HiOutlineTrash />
                    {t('users.table.actions.hardDelete')}
                </Dropdown.Item>
            </Dropdown>

            <DeleteUserModal
                dialogIsOpen={dialogIsOpen}
                firstName={firstName}
                lastName={lastName}
                onDialogClose={closeHardDelete}
                id={id}
            />
            <SoftDeleteUserModal
                dialogIsOpen={softDialogIsOpen}
                firstName={firstName}
                lastName={lastName}
                onDialogClose={closeSoftDelete}
                id={id}
            />
        </>
    )
}

export default DropdownOptions
