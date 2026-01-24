import { getApiErrorMessage } from '@/api/error'
import {  useHardDeleteLanguage } from '@/api/hooks/languages'
import { Button, Dialog, Notification, toast } from '@/components/ui'
import React from 'react'
import { useTranslation, Trans } from 'react-i18next'

type DeleteLanguageModalProps = {
    dialogIsOpen: boolean
    id: string | number
    onDialogClose: () => void
    name?: string
}

const DeleteLanguageModal = ({
    dialogIsOpen,
    onDialogClose,
    name,
    id,
}: DeleteLanguageModalProps) => {
    const { t } = useTranslation()
    const { mutate, isPending } = useHardDeleteLanguage()

    const onDialogOk = () => {
        mutate({ id: id.toString() }, {
            onSuccess: () => {
                onDialogClose()
                toast.push(
                    <Notification
                        title={t('languages.deleteModal.success')}
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
                {t('languages.deleteModal.title')}
            </h5>

            <p className="text-center">
                <Trans
                    i18nKey="languages.deleteModal.message"
                    values={{ name }}
                    components={{ strong: <strong /> }}
                />
            </p>

            <p className="mt-3 text-red-500 text-center">
                {t('languages.deleteModal.warning')}
            </p>

            <div className="mt-6 flex justify-end">
                <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={onDialogClose}
                >
                    {t('languages.deleteModal.cancel')}
                </Button>

                <Button
                    variant="solid"
                    color="red"
                    onClick={onDialogOk}
                    loading={isPending}
                >
                    {t('languages.deleteModal.confirm')}
                </Button>
            </div>
        </Dialog>
    )
}

export default DeleteLanguageModal
