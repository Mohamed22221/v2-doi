import { getApiErrorMessage } from '@/api/error'
import { useRestoreSeller } from '@/api/hooks/sellers'
import { Dialog, Notification, toast, Icon } from '@/components/ui'
import { useTranslation, Trans } from 'react-i18next'
import { ModalHeader, ModalBody, ModalFooter, StatusModalConfig } from '@/components/shared/StatusModal'

type SellerRestoreModalProps = {
    isOpen: boolean
    id: string
    onClose: () => void
    firstName?: string
    lastName?: string
}

const SellerRestoreModal = ({
    isOpen,
    onClose,
    firstName,
    lastName,
    id,
}: SellerRestoreModalProps) => {
    const { t } = useTranslation()
    const { mutate, isPending } = useRestoreSeller()

    const name = `${firstName ?? ''} ${lastName ?? ''}`.trim() || t('common.unknownUser')

    const onConfirm = () => {
        mutate(id, {
            onSuccess: () => {
                onClose()
                toast.push(
                    <Notification
                        title={t('sellers.details.restoreDeleteModal.success')}
                        type="success"
                    />,
                )
            },
            onError: (error) => {
                toast.push(
                    <Notification
                        title={getApiErrorMessage(error)}
                        type="danger"
                    />,
                )
            },
        })
    }

    const config: StatusModalConfig = {
        title: t('sellers.details.restoreDeleteModal.title'),
        description: '',
        icon: <Icon name="hideModal" />,
        confirmText: t('sellers.details.restoreDeleteModal.confirm'),
        confirmVariant: 'solid',
        confirmColor: 'emerald',
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
                        < Trans
                            i18nKey="sellers.details.restoreDeleteModal.message"
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

export default SellerRestoreModal
