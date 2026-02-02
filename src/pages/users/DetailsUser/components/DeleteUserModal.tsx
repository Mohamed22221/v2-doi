import { getApiErrorMessage } from '@/api/error'
import { useHardDeleteUser } from '@/api/hooks/users'
import { Dialog, Notification, toast, Icon } from '@/components/ui'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ModalHeader, ModalBody, ModalFooter, StatusModalConfig } from '@/components/shared/StatusModal'

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

    const config: StatusModalConfig = {
        title: t('users.userDetails.hardDeleteModal.title'),
        description: '', // We'll use children for rich content
        icon: <Icon name="errorModal" className="text-red-500" />,
        confirmText: t('users.userDetails.hardDeleteModal.confirm'),
        confirmVariant: 'solid',
        confirmColor: 'red',
    }

    return (
        <Dialog
            isOpen={dialogIsOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            width={500}
        >
            <ModalHeader config={config} />
            <ModalBody>
                <div className="text-center px-4">
                    <p>
                        <Trans
                            i18nKey="users.userDetails.hardDeleteModal.message"
                            values={{ name }}
                            components={{ strong: <strong /> }}
                        />
                    </p>
                    <p className="mt-3 text-red-500">
                        {t('users.userDetails.hardDeleteModal.warning')}
                    </p>
                </div>
            </ModalBody>
            <ModalFooter
                config={config}
                onClose={onDialogClose}
                onConfirm={onDialogOk}
                isPending={isPending}
            />
        </Dialog>
    )
}

export default HardDeleteUserModal
