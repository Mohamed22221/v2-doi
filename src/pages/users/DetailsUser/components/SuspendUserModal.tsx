import { Button, Dialog } from '@/components/ui'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

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
                {isActive 
                    ? t('users.userDetails.suspendModal.titleSuspend') 
                    : t('users.userDetails.suspendModal.titleActivate')}
            </h5>
            <p>
                {isActive ? (
                    <Trans
                        i18nKey="users.userDetails.suspendModal.confirmSuspendMessage"
                        values={{ name: `${firstName} ${lastName}` }}
                        components={{ strong: <strong /> }}
                    />
                ) : (
                    <Trans
                        i18nKey="users.userDetails.suspendModal.confirmActivateMessage"
                        values={{ name: `${firstName} ${lastName}` }}
                        components={{ strong: <strong /> }}
                    />
                )}
            </p>
            <div className="mt-6 flex justify-end">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={onDialogClose}
                >
                    {t('users.userDetails.suspendModal.cancel')}
                </Button>
                <Button
                    variant="solid"
                    onClick={onDialogConfirm}
                    loading={isLoading}
                >
                    {isActive 
                        ? t('users.userDetails.suspendModal.confirmSuspension') 
                        : t('users.userDetails.suspendModal.confirmActivation')}
                </Button>
            </div>
        </Dialog>
    )
}

export default SuspendUserModal
