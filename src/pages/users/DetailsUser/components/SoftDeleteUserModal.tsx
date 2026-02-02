import { getApiErrorMessage } from '@/api/error'
import { useSoftDeleteUser } from '@/api/hooks/users'
import { Dialog, Notification, toast, Icon } from '@/components/ui'
import { useTranslation, Trans } from 'react-i18next'
import { ModalHeader, ModalBody, ModalFooter, StatusModalConfig } from '@/components/shared/StatusModal'

type DeleteModalProps = {
    dialogIsOpen: boolean
    id: string | number
    onDialogClose: () => void
    firstName?: string
    lastName?: string
}

const SoftDeleteUserModal = ({
    dialogIsOpen,
    onDialogClose,
    firstName,
    lastName,
    id,
}: DeleteModalProps) => {
    const { t } = useTranslation()
    const { mutate, isPending } = useSoftDeleteUser()
    const name =
        `${firstName ?? ''} ${lastName ?? ''}`.trim() || t('common.unknownUser')

    const onDialogOk = () => {
        mutate(
            { id },
            {
                onSuccess: () => {
                    onDialogClose()
                    toast.push(
                        <Notification
                            title={t('users.userDetails.softDeleteModal.success')}
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
            },
        )
    }

    const config: StatusModalConfig = {
        title: t('users.userDetails.softDeleteModal.title'),
        description: t('users.userDetails.softDeleteModal.description'),
        icon: <Icon name="errorModal" className="text-red-500" />,
        confirmText: t('users.userDetails.softDeleteModal.confirm'),
        confirmVariant: 'solid',
        confirmColor: 'red',
    }

    return (
        <Dialog
            isOpen={dialogIsOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            width={500}
        >
            <ModalHeader config={config} />
            <ModalBody>
                <div className="text-center">
                    <p>
                        <Trans
                            i18nKey="users.userDetails.softDeleteModal.message"
                            values={{ name }}
                            components={{ strong: <strong /> }}
                        />
                    </p>
                </div>
            </ModalBody>
            <ModalFooter
                config={config}
                onClose={onDialogClose}
                onConfirm={onDialogOk}
                isPending={isPending}
            />
        </Dialog>
    )
}

export default SoftDeleteUserModal
