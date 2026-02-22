import { useTranslation } from 'react-i18next'
import {
    Dialog,
    Notification,
    toast,
} from '@/components/ui'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    StatusModalConfig,
} from '@/components/shared/StatusModal'
import { useDeleteRegion } from '@/api/hooks/regions'
import { getApiErrorMessage } from '@/api/error'
import { Region } from '@/api/types/regions'
import Icon from '@/components/ui/Icon/Icon'

type RegionDeleteModalProps = {
    isOpen: boolean
    onClose: () => void
    region: Region | null
}

/**
 * RegionDeleteModal Component
 * A confirmation modal for deleting a region.
 * Displays the number of cities and handles the deletion API call.
 */
const RegionDeleteModal = ({
    isOpen,
    onClose,
    region,
}: RegionDeleteModalProps) => {
    const { t, i18n } = useTranslation()
    const { mutate: deleteRegion, isPending } = useDeleteRegion()

    if (!region) return null

    const localizedName = i18n.language === 'ar' ? region?.nameAr : region?.name

    const onConfirm = () => {
        deleteRegion(region.id, {
            onSuccess: () => {
                toast.push(
                    <Notification
                        title={t('locations.regions.modal.success.delete')}
                        type="success"
                    />
                )
                onClose()
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
        title: t('locations.regions.modal.delete.title', { name: localizedName }),
        description: '',
        icon: <Icon name="errorModal" />,
        confirmText: t('locations.regions.modal.delete.confirm'),
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
                        {t('locations.regions.modal.delete.description', {
                            count: region.citiesCount || 0
                        })}
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

export default RegionDeleteModal
