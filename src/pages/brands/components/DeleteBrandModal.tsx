import { getApiErrorMessage } from '@/api/error'
import {
    useSoftDeleteBrand,
    useHardDeleteBrand,
} from '@/api/hooks/brands'
import {
    Button,
    Dialog,
    Notification,
    toast,
    Radio,
    Icon,
    Badge,
} from '@/components/ui'
import React, { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import classNames from 'classnames'

type DeleteBrandModalProps = {
    dialogIsOpen: boolean
    id: string | number
    onDialogClose: () => void
    brandName?: string
}

type DeleteOption = 'softDelete' | 'hardDelete'

const DeleteBrandModal = ({
    dialogIsOpen,
    onDialogClose,
    brandName,
    id,
}: DeleteBrandModalProps) => {
    const { t } = useTranslation()
    const [selectedOption, setSelectedOption] = useState<DeleteOption>('softDelete')

    const { mutate: softDelete, isPending: isSoftDeleting } =
        useSoftDeleteBrand()
    const { mutate: hardDelete, isPending: isHardDeleting } =
        useHardDeleteBrand()

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

        if (selectedOption === 'softDelete') {
            softDelete(id.toString(), {
                onSuccess: () =>
                    onSuccess('brands.deleteModal.successSoftDelete'),
                onError,
            })
        } else {
            hardDelete(id.toString(), {
                onSuccess: () =>
                    onSuccess('brands.deleteModal.successHardDelete'),
                onError,
            })
        }
    }

    const isPending = isSoftDeleting || isHardDeleting

    const getOptionClasses = (
        option: DeleteOption,
        baseClassName: string = '',
    ) => {
        const isActive = selectedOption === option
        const isRed = option === 'hardDelete'

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
                    alt="Success"
                    className="w-24 h-24 mb-6"
                />

                <h3 className="mb-2 font-bold text-neutral-950 dark:text-neutral-50 text-lg">
                    {t('brands.deleteModal.canDeleteTitle')}
                </h3>

                <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm text-sm leading-relaxed">
                    <Trans
                        i18nKey="brands.deleteModal.descriptionAllowed"
                        values={{
                            name: brandName,
                        }}
                        components={{
                            strong: (
                                <span className="font-semibold text-primary-500 dark:text-primary-100" />
                            ),
                        }}
                    />
                </p>

                <Radio.Group
                    vertical
                    value={selectedOption}
                    onChange={(val) => setSelectedOption(val as DeleteOption)}
                    className="w-full space-y-4"
                >
                    <div
                        className={getOptionClasses('softDelete')}
                        onClick={() => setSelectedOption('softDelete')}
                    >
                        <Radio value="softDelete" className="mt-1" />
                        <div className="flex-1 text-left">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                                    {t('brands.deleteModal.softDeleteOption')}
                                </span>
                                <Badge
                                    content="Recommended"
                                    className="bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 border-none rounded-md px-2 py-0 text-[10px] font-bold"
                                />
                            </div>
                            <p className="text-xs text-neutral-400 leading-relaxed text-start">
                                {t('brands.deleteModal.softDeleteDescription')}
                            </p>
                        </div>
                        <Icon
                            name="delete"
                            className="shrink-0 text-primary-500 dark:text-primary-100"
                        />
                    </div>

                    <div
                        className={getOptionClasses('hardDelete')}
                        onClick={() => setSelectedOption('hardDelete')}
                    >
                        <Radio value="hardDelete" className="mt-1" />
                        <div className="flex-1 text-start">
                            <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm block mb-1">
                                {t('brands.deleteModal.hardDeleteOption')}
                            </span>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                {t('brands.deleteModal.hardDeleteDescription')}
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
                    {t('brands.deleteModal.cancel')}
                </Button>

                <Button
                    variant="solid"
                    color="red"
                    className="flex-[1.5] rounded-xl h-12 font-bold"
                    onClick={onConfirm}
                    loading={isPending}
                >
                    {selectedOption === 'softDelete'
                        ? t('brands.deleteModal.confirmSoftDelete')
                        : t('brands.deleteModal.confirmHardDelete')}
                </Button>
            </div>
        </Dialog>
    )
}

export default DeleteBrandModal
