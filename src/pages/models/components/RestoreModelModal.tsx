import { getApiErrorMessage } from '@/api/error'
import { useRestoreModel } from '@/api/hooks/models'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { useTranslation, Trans } from 'react-i18next'

type RestoreModelModalProps = {
    dialogIsOpen: boolean
    id: string
    onDialogClose: () => void
    modelName: string
}

const RestoreModelModal = ({
    dialogIsOpen,
    onDialogClose,
    modelName,
    id,
}: RestoreModelModalProps) => {
    const { t } = useTranslation()
    const { mutate, isPending } = useRestoreModel()

    const onDialogOk = () => {
        mutate(id, {
            onSuccess: () => {
                onDialogClose()
                toast.push(
                    <Notification
                        title={t('models.restoreModal.success')}
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
                {t('models.restoreModal.title')}
            </h5>

            <p className="text-center">
                <Trans
                    i18nKey="models.restoreModal.message"
                    values={{ name: modelName }}
                    components={{ strong: <strong /> }}
                />
            </p>

            <div className="mt-6 flex justify-end">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={onDialogClose}
                >
                    {t('models.restoreModal.cancel')}
                </Button>

                <Button
                    variant="solid"
                    color="green"
                    onClick={onDialogOk}
                    loading={isPending}
                >
                    {t('models.restoreModal.confirm')}
                </Button>
            </div>
        </Dialog>
    )
}

export default RestoreModelModal
