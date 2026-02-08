import { Dialog, Icon, Notification, toast } from '@/components/ui'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { ModalHeader, ModalBody, ModalFooter, StatusModalConfig } from '@/components/shared/StatusModal'
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
        title: t('fixedPrice.sellers.details.modals.approve.title'),
        description: '',
        icon: <Icon name="hideModal" />,
        confirmText: t('fixedPrice.sellers.details.modals.approve.confirm'),
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
                            i18nKey="fixedPrice.sellers.details.modals.approve.description"
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
