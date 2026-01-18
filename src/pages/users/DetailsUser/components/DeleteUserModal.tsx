import { getApiErrorMessage } from '@/api/error'
import { useHardDeleteUser } from '@/api/hooks/users'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

type DeleteModalProps = {
    dialogIsOpen: boolean
    id: string | number
    onDialogClose: () => void
    firstName?: string
    lastName?: string
}

const HardDeleteUserModal = ({
    dialogIsOpen,
    onDialogClose,
    firstName,
    lastName,
    id,
}: DeleteModalProps) => {
    const { t } = useTranslation()
    const { mutate, isPending } = useHardDeleteUser()
    const navigate = useNavigate()
    const name =
        `${firstName ?? ''} ${lastName ?? ''}`.trim() || t('common.unknownUser')
    const onDialogOk = () => {
        mutate(
            { id },
            {
                onSuccess: () => {
                    onDialogClose()
                    toast.push(
                        <Notification
                            title={t('users.userDetails.hardDeleteModal.success')}
                            type="success"
                        />,
                    )
                    navigate('/users')
                },
                onError: (error) => {
                    toast.push(
                        <Notification
                            title={getApiErrorMessage(error)}
                            type="danger"
                        />,
                    )
                },
            },
        )
    }
    return (
        <Dialog
            isOpen={dialogIsOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            style={{
                content: {
                    marginTop: 250,
                },
            }}
        >
            <h5 className="mb-4 text-center">
                {t('users.userDetails.hardDeleteModal.title')}
            </h5>

            <p className="text-center">
                <Trans
                    i18nKey="users.userDetails.hardDeleteModal.message"
                    values={{ name }}
                    components={{ strong: <strong /> }}
                />
            </p>

            <p className="mt-3 text-red-500 text-center">
                {t('users.userDetails.hardDeleteModal.warning')}
            </p>

            <div className="mt-6">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={onDialogClose}
                >
                    {t('users.userDetails.hardDeleteModal.cancel')}
                </Button>

                <Button
                    variant="solid"
                    // لو عندك variant="danger" استخدمه بدل solid
                    className="bg-red-600 hover:bg-red-700"
                    onClick={onDialogOk}
                    loading={isPending}
                >
                    {t('users.userDetails.hardDeleteModal.confirm')}
                </Button>
            </div>
        </Dialog>
    )
}

export default HardDeleteUserModal
