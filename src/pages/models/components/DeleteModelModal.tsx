import React, { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import classNames from 'classnames'
import {
    Button,
    Dialog,
    Notification,
    toast,
    Radio,
    Icon,
    Badge,
} from '@/components/ui'
import { useSoftDeleteModel, useHardDeleteModel } from '@/api/hooks/models'
import { getApiErrorMessage } from '@/api/error'

interface DeleteModelModalProps {
    dialogIsOpen: boolean
    onDialogClose: () => void
    id: string
    modelName: string
}

type DeleteType = 'soft' | 'hard'

const DeleteModelModal = ({
    dialogIsOpen,
    onDialogClose,
    id,
    modelName,
}: DeleteModelModalProps) => {
    const { t } = useTranslation()
    const [deleteType, setDeleteType] = useState<DeleteType>('soft')

    const { mutate: softDelete, isPending: isSoftDeleting } = useSoftDeleteModel()
    const { mutate: hardDelete, isPending: isHardDeleting } = useHardDeleteModel()

    const onConfirm = () => {
        const onSuccess = (msgKey: string) => {
            onDialogClose()
            toast.push(<Notification title={t(msgKey)} type="success" />)
        }

        const onError = (error: Error) => {
            toast.push(
                <Notification
                    title={getApiErrorMessage(error)}
                    type="danger"
                />,
            )
        }

        if (deleteType === 'soft') {
            softDelete(id, {
                onSuccess: () => onSuccess('models.deleteModal.successSoftDelete'),
                onError,
            })
        } else {
            hardDelete(id, {
                onSuccess: () => onSuccess('models.deleteModal.successHardDelete'),
                onError,
            })
        }
    }

    const isPending = isSoftDeleting || isHardDeleting

    const getOptionClasses = (
        option: DeleteType,
        baseClassName: string = '',
    ) => {
        const isActive = deleteType === option
        const isRed = option === 'hard'

        return classNames(
            'border rounded-xl p-4 transition-all cursor-pointer flex items-start gap-4',
            isActive
                ? isRed
                    ? 'border-red-200 bg-red-50/50 dark:border-red-700 dark:bg-red-900/10'
                    : 'border-primary-200 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/20'
                : 'border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700',
            baseClassName,
        )
    }

    return (
        <Dialog
            isOpen={dialogIsOpen}
            onClose={onDialogClose}
            onRequestClose={onDialogClose}
            width={550}
        >
            <div className="flex flex-col items-center text-center p-2">
                <img
                    src="/img/can-delete-success.png"
                    alt="Can Delete"
                    className="w-24 h-24 mb-6"
                />

                <h3 className="mb-2 font-bold text-neutral-950 dark:text-neutral-50 text-lg">
                    {t('models.deleteModal.canDeleteTitle')}
                </h3>

                <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm text-sm leading-relaxed">
                    <Trans
                        i18nKey="models.deleteModal.descriptionAllowed"
                        values={{ name: modelName }}
                        components={{
                            strong: (
                                <span className="font-semibold text-primary-500 dark:text-primary-100" />
                            ),
                        }}
                    />
                </p>

                <Radio.Group
                    vertical
                    value={deleteType}
                    onChange={(val) => setDeleteType(val as DeleteType)}
                    className="w-full space-y-4"
                >
                    <div
                        className={getOptionClasses('soft')}
                        onClick={() => setDeleteType('soft')}
                    >
                        <Radio value="soft" className="mt-1" />
                        <div className="flex-1 text-left">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                                    {t('models.deleteModal.softDeleteOption')}
                                </span>
                                <Badge
                                    content="Recommended"
                                    className="bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 border-none rounded-md px-2 py-0 text-[10px] font-bold"
                                />
                            </div>
                            <p className="text-xs text-neutral-400 leading-relaxed text-start">
                                {t('models.deleteModal.softDeleteDescription')}
                            </p>
                        </div>
                        <Icon
                            name="delete"
                            className="shrink-0 text-primary-500 dark:text-primary-100"
                        />
                    </div>

                    <div
                        className={getOptionClasses('hard')}
                        onClick={() => setDeleteType('hard')}
                    >
                        <Radio value="hard" className="mt-1" />
                        <div className="flex-1 text-start">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm block mb-1">
                                {t('models.deleteModal.hardDeleteOption')}
                            </span>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                {t('models.deleteModal.hardDeleteDescription')}
                            </p>
                        </div>
                        <Icon
                            name="delete"
                            className="shrink-0 text-red-500"
                        />
                    </div>
                </Radio.Group>
            </div>

            <div className="mt-8 flex justify-between gap-4">
                <Button
                    variant="plain"
                    onClick={onDialogClose}
                    className="flex-1 rounded-xl text-neutral-400 hover:text-neutral-500 font-bold border border-neutral-100 dark:border-neutral-700 h-12"
                >
                    {t('models.deleteModal.cancel')}
                </Button>

                <Button
                    variant="solid"
                    color={deleteType === 'soft' ? 'red' : 'red'}
                    className="flex-[1.5] rounded-xl h-12 font-bold"
                    onClick={onConfirm}
                    loading={isPending}
                >
                    {deleteType === 'soft'
                        ? t('models.deleteModal.confirmSoftDelete')
                        : t('models.deleteModal.confirmHardDelete')}
                </Button>
            </div>
        </Dialog>
    )
}

export default DeleteModelModal
