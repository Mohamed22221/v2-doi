import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

// UI Components
import { Dialog, Icon, Notification, toast } from '@/components/ui'

// Shared Components
import { ModalHeader, ModalBody, ModalFooter, StatusModalConfig } from '@/components/shared/StatusModal'

// Hooks
import { useApproveSeller } from '@/api/hooks/sellers'
import { getApiErrorMessage } from '@/api/error'

type SellerApproveModalProps = {
    isOpen: boolean
    onClose: () => void
    id: string
    firstName?: string
    lastName?: string
    onConfirmSuccess?: () => void
}

/**
 * Modal component for approving a seller request
 * Features: Shows the seller's name and asks for confirmation
 */
const SellerApproveModal = ({
    isOpen,
    onClose,
    id,
    firstName,
    lastName,
    onConfirmSuccess,
}: SellerApproveModalProps) => {
    const { t } = useTranslation()
    const { mutate: approveSeller, isPending } = useApproveSeller()

    const name = `${firstName ?? ''} ${lastName ?? ''}`.trim() || t('common.unknownUser')

    /**
     * Handles the approval confirmation
     */
    const onConfirm = () => {
        approveSeller(id, {
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
        title: t('sellers.details.modals.approve.title'),
        description: '',
        icon: <Icon name="hideModal" />,
        confirmText: t('sellers.details.modals.approve.confirm'),
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
                            i18nKey="sellers.details.modals.approve.description"
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

export default SellerApproveModal
