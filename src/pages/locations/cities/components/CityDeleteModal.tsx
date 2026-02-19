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
import { useDeleteCity } from '@/api/hooks/cities'
import { getApiErrorMessage } from '@/api/error'
import { City } from '@/api/types/cities'
import Icon from '@/components/ui/Icon/Icon'

type CityDeleteModalProps = {
    isOpen: boolean
    onClose: () => void
    city: City | null
}

const CityDeleteModal = ({
    isOpen,
    onClose,
    city,
}: CityDeleteModalProps) => {
    const { t, i18n } = useTranslation()
    const { mutate: deleteCity, isPending } = useDeleteCity()

    if (!city) return null

    const localizedName = i18n.language === 'ar' ? city.nameAr : city.name

    const onConfirm = () => {
        deleteCity(city.id, {
            onSuccess: () => {
                toast.push(
                    <Notification
                        title={t('locations.cities.modal.success.delete')}
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
        title: t('locations.cities.modal.delete.title', { name: localizedName }),
        description: '',
        icon: <Icon name="errorModal" />,
        confirmText: t('locations.cities.modal.delete.confirm'),
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
                        {t('locations.cities.modal.delete.description', {
                            count: Number(city.areas) || 0
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

export default CityDeleteModal
