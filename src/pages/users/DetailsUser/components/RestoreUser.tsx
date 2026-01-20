import { Button } from '@/components/ui'
import { HiExclamation, HiOutlineRefresh } from 'react-icons/hi'
import RestoreDeleteModal from './RestoreDeleteModal'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type RestoreModalProps = {
    id?: string | number
    firstName?: string
    lastName?: string
}

const RestoreUser = ({ firstName, lastName, id }: RestoreModalProps) => {
    const { t } = useTranslation()
    const [dialogIsOpen, setIsOpen] = useState(false)
    const openDialog = () => setIsOpen(true)
    const onDialogClose = () => setIsOpen(false)

    return (
        <div className="m-2 rounded-2xl border border-yellow-200 bg-yellow-100 p-3">
            {/* Responsive wrapper */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: icon + message */}
                <div className="flex min-w-0 items-start gap-2 text-yellow-600 sm:items-center">
                    <HiExclamation size={22} className="shrink-0 mt-0.5 sm:mt-0" />
                    <p className="min-w-0 sm:text-base text-[14px] text-yellow-600 break-words">
                        {t('users.userDetails.restoreDeleteModal.msgRestore')}
                    </p>
                </div>

                {/* Right: button */}
                <div className="sm:shrink-0">
                    <Button
                        color="green"
                        variant="solid"
                        icon={<HiOutlineRefresh />}
                        onClick={openDialog}
                        className="w-full sm:w-auto"
                    >
                        {t('users.userDetails.restoreDeleteModal.btnRestore')}
                    </Button>
                </div>
            </div>

            <RestoreDeleteModal
                dialogIsOpen={dialogIsOpen}
                onDialogClose={onDialogClose}
                id={id!}
                firstName={firstName}
                lastName={lastName}
            />
        </div>
    )
}

export default RestoreUser
