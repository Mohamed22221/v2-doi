import { getApiErrorMessage } from '@/api/error'
import { useRestoreDeletedUser } from '@/api/hooks/users'
import { Dialog, Notification, toast, Icon } from '@/components/ui'
import { useTranslation, Trans } from 'react-i18next'
import { ModalHeader, ModalBody, ModalFooter, StatusModalConfig } from '@/components/shared/StatusModal'

type RestoreDeleteModalProps = {
    dialogIsOpen: boolean
    id: string | number
    onDialogClose: () => void
    firstName?: string
    lastName?: string
}

const RestoreDeleteModal = ({
    dialogIsOpen,
    onDialogClose,
    firstName,
    lastName,
    id,
}: RestoreDeleteModalProps) => {
    const { t } = useTranslation()
    const { mutate, isPending } = useRestoreDeletedUser()

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
                            title={t('users.userDetails.restoreDeleteModal.success')}
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
        title: t('users.userDetails.restoreDeleteModal.title'),
        description: '', // Using children
        icon: <Icon name="hideModal" />,
        confirmText: t('users.userDetails.restoreDeleteModal.confirm'),
        confirmVariant: 'solid',
        confirmColor: 'emerald',
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
                            i18nKey="users.userDetails.restoreDeleteModal.message"
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

export default RestoreDeleteModal
