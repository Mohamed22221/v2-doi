import { useTranslation } from 'react-i18next'
import {
    Notification,
    toast,
    Dialog,
} from '@/components/ui'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    StatusModalConfig,
} from '@/components/shared/StatusModal'
import { useDeleteArea } from '@/api/hooks/areas'
import { getApiErrorMessage } from '@/api/error'
import { Area } from '@/api/types/areas'
import Icon from '@/components/ui/Icon/Icon'

type AreaDeleteModalProps = {
    isOpen: boolean
    onClose: () => void
    area: Area | null
    onSuccess?: () => void
}

const AreaDeleteModal = ({
    isOpen,
    onClose,
    area,
    onSuccess,
}: AreaDeleteModalProps) => {
    const { t, i18n } = useTranslation()
    const { mutate: deleteArea, isPending } = useDeleteArea()

    if (!area) return null

    const isAr = i18n.language === 'ar'
    const localizedName = isAr ? area.nameAr : area.name

    const onConfirm = () => {
        deleteArea(area.id, {
            onSuccess: () => {
                toast.push(
                    <Notification
                        title={t('locations.areas.modal.success.delete')}
                        type="success"
                    />
                )
                onSuccess?.()
                onClose()
            },
            onError: (error) => {
                toast.push(
                    <Notification
                        title={getApiErrorMessage(error)}
                        type="danger"
                    />
                )
            },
        })
    }

    const config: StatusModalConfig = {
        title: t('locations.areas.modal.delete.title', { name: localizedName }),
        description: '',
        icon: <Icon name="errorModal" />,
        confirmText: t('locations.areas.modal.delete.confirm'),
        confirmVariant: 'solid',
        confirmColor: 'red',
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
                <div className="text-center space-y-2">
                    <p className="text-gray-500 dark:text-gray-400">
                        {t('locations.areas.modal.delete.description')}
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

export default AreaDeleteModal
