import { getApiErrorMessage } from '@/api/error'
import { useRestoreBrand } from '@/api/hooks/brands'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import { useTranslation, Trans } from 'react-i18next'
import { HiOutlineRefresh } from 'react-icons/hi'

type RestoreBrandModalProps = {
    dialogIsOpen: boolean
    id: string
    onDialogClose: () => void
    brandName: string
}

const RestoreBrandModal = ({
    dialogIsOpen,
    onDialogClose,
    brandName,
    id,
}: RestoreBrandModalProps) => {
    const { t } = useTranslation()
    const { mutate, isPending } = useRestoreBrand()

    const onDialogOk = () => {
        mutate(id, {
            onSuccess: () => {
                onDialogClose()
                toast.push(
                    <Notification
                        title={t('brands.restoreModal.success')}
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
                {t('brands.restoreModal.title')}
            </h5>

            <p className="text-center">
                <Trans
                    i18nKey="brands.restoreModal.message"
                    values={{ name: brandName }}
                    components={{ strong: <strong /> }}
                />
            </p>

            <div className="mt-6 flex justify-end">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={onDialogClose}
                >
                    {t('brands.restoreModal.cancel')}
                </Button>

                <Button
                    variant="solid"
                    color="green"
                    icon={<HiOutlineRefresh />}
                    onClick={onDialogOk}
                    loading={isPending}
                >
                    {t('brands.restoreModal.confirm')}
                </Button>
            </div>
        </Dialog>
    )
}

export default RestoreBrandModal
