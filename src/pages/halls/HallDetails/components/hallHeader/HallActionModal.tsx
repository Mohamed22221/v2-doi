import { useTranslation } from 'react-i18next'
import {
    Dialog,
    Notification,
    toast,
    Icon,
} from '@/components/ui'
import { ModalHeader, ModalFooter } from '@/components/shared/StatusModal'
import type { StatusModalConfig } from '@/components/shared/StatusModal'
import { useArchiveHall, useDeleteHall } from '@/api/hooks/halls'
import { getApiErrorMessage } from '@/api/error'

export type HallActionType = 'schedule' | 'delete'

interface HallActionModalProps {
    isOpen: boolean
    onClose: () => void
    type: HallActionType
    hallId: string
    onConfirmSuccess?: () => void
}

const HallActionModal = ({
    isOpen,
    onClose,
    type,
    hallId,
    onConfirmSuccess,
}: HallActionModalProps) => {
    const { t } = useTranslation()

    const { mutate: archiveHall, isPending: isArchivePending } = useArchiveHall()
    const { mutate: deleteHall, isPending: isDeletePending } = useDeleteHall()

    const isPending = isArchivePending || isDeletePending

    const handleSuccess = () => {
        toast.push(
            <Notification
                title={t('common.success')}
                type="success"
            />
        )
        onClose()
        onConfirmSuccess?.()
    }

    const handleError = (error: any) => {
        toast.push(
            <Notification
                title={getApiErrorMessage(error)}
                type="danger"
            />
        )
    }

    const handleConfirm = () => {
        switch (type) {
            case 'schedule':
                archiveHall(hallId, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                })
                break
            case 'delete':
                deleteHall(hallId, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                })
                break
        }
    }

    const getModalConfig = (): StatusModalConfig => {
        switch (type) {
            case 'schedule':
                return {
                    title: t('halls.details.modals.schedule.title'),
                    description: t('halls.details.modals.schedule.description'),
                    icon: <Icon name="hideModal" />,
                    confirmText: t('halls.details.modals.schedule.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'primary',
                }
            case 'delete':
                return {
                    title: t('halls.details.modals.delete.title'),
                    description: t('halls.details.modals.delete.description'),
                    icon: <Icon name="errorModal" />,
                    confirmText: t('halls.details.modals.delete.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
        }
    }

    const config = getModalConfig()

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={500}
        >
            <ModalHeader config={config} />
            <ModalFooter
                config={config}
                onClose={onClose}
                onConfirm={handleConfirm}
                isPending={isPending}
            />
        </Dialog>
    )
}

export default HallActionModal
