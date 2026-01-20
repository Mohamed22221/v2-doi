import { getApiErrorMessage } from '@/api/error'
import { useRestoreDeletedUser } from '@/api/hooks/users'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { useTranslation, Trans } from 'react-i18next'

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

    return (
        <Dialog
            isOpen={dialogIsOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            style={{
                content: {
                    marginTop: 250,
                },
            }}
        >
            <h5 className="mb-4 text-center">
                {t('users.userDetails.restoreDeleteModal.title')}
            </h5>

            <p className="text-center">
                <Trans
                    i18nKey="users.userDetails.restoreDeleteModal.message"
                    values={{ name }}
                    components={{ strong: <strong /> }}
                />
            </p>

            <div className="mt-6 flex justify-end">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={onDialogClose}
                >
                    {t('users.userDetails.restoreDeleteModal.cancel')}
                </Button>

                <Button
                    variant="solid"
                    color="green"
                    onClick={onDialogOk}
                    loading={isPending}
                >
                    {t('users.userDetails.restoreDeleteModal.confirm')}
                </Button>
            </div>
        </Dialog>
    )
}

export default RestoreDeleteModal
