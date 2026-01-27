import { getApiErrorMessage } from '@/api/error'
import { useRestoreCategory } from '@/api/hooks/categories'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { useTranslation, Trans } from 'react-i18next'
import { HiOutlineRefresh } from 'react-icons/hi'

type RestoreCategoryModalProps = {
    dialogIsOpen: boolean
    id: string
    onDialogClose: () => void
    categoryName: string
}

const RestoreCategoryModal = ({
    dialogIsOpen,
    onDialogClose,
    categoryName,
    id,
}: RestoreCategoryModalProps) => {
    const { t } = useTranslation()
    const { mutate, isPending } = useRestoreCategory()

    const onDialogOk = () => {
        mutate(id, {
            onSuccess: () => {
                onDialogClose()
                toast.push(
                    <Notification
                        title={t('categories.restoreModal.success')}
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
                {t('categories.restoreModal.title')}
            </h5>

            <p className="text-center">
                <Trans
                    i18nKey="categories.restoreModal.message"
                    values={{ name: categoryName }}
                    components={{ strong: <strong /> }}
                />
            </p>

            <div className="mt-6 flex justify-end">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={onDialogClose}
                >
                    {t('categories.restoreModal.cancel')}
                </Button>

                <Button
                    variant="solid"
                    color='green'
                    // Color green can be added here if needed, following the user's preference in models
                    icon={<HiOutlineRefresh />}
                    onClick={onDialogOk}
                    loading={isPending}
                >
                    {t('categories.restoreModal.confirm')}
                </Button>
            </div>
        </Dialog>
    )
}

export default RestoreCategoryModal
