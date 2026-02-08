import { Dialog, Icon, Notification, toast } from '@/components/ui'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { ModalHeader, ModalBody, ModalFooter, StatusModalConfig } from '@/components/shared/StatusModal'
import { useActivateSeller } from '@/api/hooks/sellers'
import { getApiErrorMessage } from '@/api/error'

type SellerActivateModalProps = {
    isOpen: boolean
    onClose: () => void
    id: string
    firstName?: string
    lastName?: string
    onConfirmSuccess?: () => void
}

const SellerActivateModal = ({
    isOpen,
    onClose,
    id,
    firstName,
    lastName,
    onConfirmSuccess,
}: SellerActivateModalProps) => {
    const { t } = useTranslation()
    const { mutate: activateSeller, isPending } = useActivateSeller()

    const name = `${firstName ?? ''} ${lastName ?? ''}`.trim() || t('common.unknownUser')

    const onConfirm = () => {
        activateSeller(id, {
            onSuccess: () => {
                toast.push(
                    <Notification
                        title={t('common.success')}
                        type="success"
                    />
                )
                onClose()
                if (onConfirmSuccess) onConfirmSuccess()
            },
            onError: (error) => {
                toast.push(
                    <Notification
                        title={getApiErrorMessage(error)}
                        type="danger"
                    />
                )
            }
        })
    }

    const config: StatusModalConfig = {
        title: t('users.userDetails.suspendModal.titleActivate'),
        description: '',
        icon: <Icon name="hideModal" />,
        confirmText: t('users.userDetails.suspendModal.confirmActivation'),
        confirmVariant: 'solid',
        confirmColor: 'green',
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={500}
        >
            <ModalHeader config={config} />
            <ModalBody>
                <div className="text-center">
                    <p>
                        <Trans
                            i18nKey="users.userDetails.suspendModal.confirmActivateMessage"
                            values={{ name }}
                            components={{ strong: <strong /> }}
                        />
                    </p>
                </div>
            </ModalBody>
            <ModalFooter
                config={config}
                onClose={onClose}
                onConfirm={onConfirm}
                isPending={isPending}
            />
        </Dialog>
    )
}

export default SellerActivateModal
