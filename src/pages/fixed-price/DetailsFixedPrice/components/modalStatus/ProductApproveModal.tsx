import { Dialog, Icon, Notification, toast } from '@/components/ui'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { ModalHeader, ModalBody, ModalFooter, StatusModalConfig } from '@/components/shared/StatusModal'
import { useApproveProduct } from '@/api/hooks/products'
import { getApiErrorMessage } from '@/api/error'

type ProductApproveModalProps = {
    isOpen: boolean
    onClose: () => void
    id: string
    title?: string
    onConfirmSuccess?: () => void
}

/**
 * ProductApproveModal Component
 * A confirmation modal for approving a product.
 * Displays a warning message and handles the approval API call.
 */
const ProductApproveModal = ({
    isOpen,
    onClose,
    id,
    title,
    onConfirmSuccess,
}: ProductApproveModalProps) => {
    const { t } = useTranslation()
    const { mutate: approveProduct, isPending } = useApproveProduct()

    const name = title || t('common.unknownItem')

    /**
     * Handles the approval confirmation
     */
    const onConfirm = () => {
        approveProduct(id, {
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

    // Configuration for the modal header and footer
    const config: StatusModalConfig = {
        title: t('fixedPrice.details.modals.approve.title'),
        description: '',
        icon: <Icon name="hideModal" />,
        confirmText: t('fixedPrice.details.modals.approve.confirm'),
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
                            i18nKey="fixedPrice.details.modals.approve.description"
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

export default ProductApproveModal
