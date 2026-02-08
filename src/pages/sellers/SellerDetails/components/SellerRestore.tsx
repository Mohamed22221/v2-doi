import { Button } from '@/components/ui'
import { HiExclamation, HiOutlineRefresh } from 'react-icons/hi'
import SellerRestoreModal from './modalStatus/SellerRestoreModal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type SellerRestoreProps = {
    id: string
    firstName?: string
    lastName?: string
}

const SellerRestore = ({ firstName, lastName, id }: SellerRestoreProps) => {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const openModal = () => setIsOpen(true)
    const onClose = () => setIsOpen(false)

    return (
        <div className="m-2 rounded-2xl border border-yellow-200 bg-yellow-100 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-2 text-yellow-600 sm:items-center">
                    <HiExclamation size={22} className="shrink-0 mt-0.5 sm:mt-0" />
                    <p className="min-w-0 sm:text-base text-[14px] text-yellow-600 break-words">
                        {t('users.userDetails.restoreDeleteModal.msgRestore')}
                    </p>
                </div>

                <div className="sm:shrink-0">
                    <Button
                        color="green"
                        variant="solid"
                        icon={<HiOutlineRefresh />}
                        onClick={openModal}
                        className="w-full sm:w-auto"
                    >
                        {t('users.userDetails.restoreDeleteModal.btnRestore')}
                    </Button>
                </div>
            </div>

            <SellerRestoreModal
                isOpen={isOpen}
                onClose={onClose}
                id={id}
                firstName={firstName}
                lastName={lastName}
            />
        </div>
    )
}

export default SellerRestore
