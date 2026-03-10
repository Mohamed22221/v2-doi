import { getApiErrorMessage } from '@/api/error'
import { useDeleteHallItem } from '@/api/hooks/halls'
import { Dialog, Notification, toast, Icon } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import {
    ModalHeader,
    ModalFooter,
    StatusModalConfig,
} from '@/components/shared/StatusModal'

type DeleteModalProps = {
    isOpen: boolean
    onClose: () => void
    id: string
}

const DeleteAssignedItemModal = ({ isOpen, onClose, id }: DeleteModalProps) => {
    const { t } = useTranslation()
    const { mutate, isPending } = useDeleteHallItem()

    const onConfirm = () => {
        mutate(id, {
            onSuccess: () => {
                onClose()
                toast.push(
                    <Notification
                        title={t('halls.details.deleteModal.success', {
                            defaultValue: 'Item removed successfully',
                        })}
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
        title: t('halls.details.deleteModal.title', {
            defaultValue: 'Delete Assigned Item',
        }),
        description: t('halls.details.deleteModal.description', {
            defaultValue:
                'Are you sure you want to remove this item from the hall? This action cannot be undone.',
        }),
        icon: <Icon name="errorModal" className="text-red-500" />,
        confirmText: t('common.delete', {
            defaultValue: 'Delete',
        }),
        confirmVariant: 'solid',
        confirmColor: 'red',
    }

    return (
        <Dialog
            isOpen={isOpen}
            width={500}
            onClose={onClose}
            onRequestClose={onClose}
        >
            <ModalHeader config={config} />

            <ModalFooter
                config={config}
                isPending={isPending}
                onClose={onClose}
                onConfirm={onConfirm}
            />
        </Dialog>
    )
}

export default DeleteAssignedItemModal
