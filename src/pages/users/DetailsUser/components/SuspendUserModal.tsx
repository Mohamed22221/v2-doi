import { Dialog, Icon } from '@/components/ui'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { ModalHeader, ModalBody, ModalFooter, StatusModalConfig } from '@/components/shared/StatusModal'

type SuspendModalProps = {
    dialogIsOpen: boolean
    onDialogClose: () => void
    onDialogConfirm: () => void
    firstName?: string
    lastName?: string
    isActive?: boolean
    isLoading: boolean
}

const SuspendUserModal = ({
    dialogIsOpen,
    onDialogClose,
    onDialogConfirm,
    firstName,
    lastName,
    isActive,
    isLoading,
}: SuspendModalProps) => {
    const { t } = useTranslation()

    const name = `${firstName ?? ''} ${lastName ?? ''}`.trim() || t('common.unknownUser')

    const config: StatusModalConfig = {
        title: isActive
            ? t('users.userDetails.suspendModal.titleSuspend')
            : t('users.userDetails.suspendModal.titleActivate'),
        description: '', // Using children for rich content
        icon: <Icon name={isActive ? 'errorModal' : 'hideModal'} />,
        confirmText: isActive
            ? t('users.userDetails.suspendModal.confirmSuspension')
            : t('users.userDetails.suspendModal.confirmActivation'),
        confirmVariant: 'solid',
        confirmColor: isActive ? 'red' : 'green',
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
                <div className="text-center">
                    <p>
                        <Trans
                            i18nKey={
                                isActive
                                    ? 'users.userDetails.suspendModal.confirmSuspendMessage'
                                    : 'users.userDetails.suspendModal.confirmActivateMessage'
                            }
                            values={{ name }}
                            components={{ strong: <strong /> }}
                        />
                    </p>
                </div>
            </ModalBody>
            <ModalFooter
                config={config}
                onClose={onDialogClose}
                onConfirm={onDialogConfirm}
                isPending={isLoading}
            />
        </Dialog>
    )
}

export default SuspendUserModal
