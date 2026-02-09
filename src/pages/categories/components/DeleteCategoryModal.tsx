import { getApiErrorMessage } from '@/api/error'
import {
    useDeactivateCategory,
    useSoftDeleteCategory,
    useHardDeleteCategory,
} from '@/api/hooks/categories'
import {
    Button,
    Dialog,
    Notification,
    toast,
    Radio,
    Icon,
    Badge,
} from '@/components/ui'
import React, { useState, useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import classNames from 'classnames'
import CategorySelect from '@/components/helpers/CategoriesSelect'

type DeleteCategoryModalProps = {
    dialogIsOpen: boolean
    id: string | number
    onDialogClose: () => void
    categoryName?: string
    itemsCount?: number
    subCategoriesCount?: number
    status?: 'active' | 'inactive'
    level?: number
}

type DeleteOption = 'disable' | 'move' | 'softDelete'

const DeleteCategoryModal = ({
    dialogIsOpen,
    onDialogClose,
    categoryName,
    id,
    itemsCount = 0,
    subCategoriesCount = 0,
    status,
    level,
}: DeleteCategoryModalProps) => {
    const { t } = useTranslation()
    const isDeletionBlocked = itemsCount > 0 || subCategoriesCount > 0

    const [selectedOption, setSelectedOption] = useState<DeleteOption>(
        isDeletionBlocked ? 'disable' : 'softDelete',
    )
    const [destinationId, setDestinationId] = useState<string | null>(null)

    const { mutate: deactivate, isPending: isDeactivating } =
        useDeactivateCategory()
    const { mutate: softDelete, isPending: isSoftDeleting } =
        useSoftDeleteCategory()
    const { mutate: hardDelete, isPending: isHardDeleting } =
        useHardDeleteCategory()

    useEffect(() => {
        if (dialogIsOpen) {
            // Scenario 2: Active & Blocked -> 'disable'
            if (isDeletionBlocked && status === 'active') {
                setSelectedOption('disable')
            }
            // Scenario 3A: Inactive & Blocked & Has SubCategories -> 'move'
            else if (
                isDeletionBlocked &&
                status !== 'active' &&
                subCategoriesCount > 0
            ) {
                setSelectedOption('move')
            }
            // Scenario 3B: Inactive & Blocked & No SubCategories -> 'softDelete'
            else if (
                isDeletionBlocked &&
                status !== 'active' &&
                subCategoriesCount === 0
            ) {
                setSelectedOption('softDelete')
            }
            // Scenario 1: Empty -> 'softDelete'
            else {
                setSelectedOption('softDelete')
            }
            setDestinationId(null)
        }
    }, [dialogIsOpen, isDeletionBlocked, status])



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

        if (selectedOption === 'disable') {
            deactivate(id.toString(), {
                onSuccess: () =>
                    onSuccess('categories.deleteModal.successDisable'),
                onError,
            })
        } else if (selectedOption === 'move' && destinationId) {
            // Bulk move logic
            hardDelete(
                {
                    id: id.toString(),
                    targetCategoryId: destinationId,
                },
                {
                    onSuccess: () =>
                        onSuccess('categories.deleteModal.successHardDelete'),
                    onError,
                },
            )
        } else if (selectedOption === 'softDelete') {
            softDelete(id.toString(), {
                onSuccess: () =>
                    onSuccess('categories.deleteModal.successSoftDelete'),
                onError,
            })
        }
    }

    const isPrimaryDisabled = selectedOption === 'move' && !destinationId
    const isPending = isDeactivating || isSoftDeleting || isHardDeleting

    const getOptionClasses = (
        option: DeleteOption,
        baseClassName: string = '',
    ) => {
        const isActive = selectedOption === option

        return classNames(
            'border rounded-xl p-4 transition-all cursor-pointer flex items-start gap-4',
            isActive
                ? 'border-primary-200 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/20'
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
            <div className="flex flex-col items-center text-center p-2 ">
                <img
                    src={
                        isDeletionBlocked
                            ? '/img/cannot-delete-warning.png'
                            : '/img/can-delete-success.png'
                    }
                    alt="Warning"
                    className="w-24 h-24 mb-6"
                />

                <h3 className="mb-2 font-bold text-neutral-950 dark:text-neutral-50 text-lg">
                    {t(
                        isDeletionBlocked
                            ? 'categories.deleteModal.cannotDeleteTitle'
                            : 'categories.deleteModal.canDeleteTitle',
                    )}
                </h3>

                <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm text-sm leading-relaxed">
                    <Trans
                        i18nKey={
                            !isDeletionBlocked
                                ? 'categories.deleteModal.descriptionAllowed'
                                : status === 'active'
                                    ? 'categories.deleteModal.descriptionBlockedActive'
                                    : subCategoriesCount > 0
                                        ? 'categories.deleteModal.descriptionBlockedInactiveSub'
                                        : 'categories.deleteModal.descriptionBlockedInactive'
                        }
                        values={{
                            name: categoryName,
                            itemsCount,
                            subCategoriesCount,
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
                    className="w-full space-y-4 max-h-54 overflow-y-auto"
                >
                    {/* Scenario 2: Blocked & Active -> Show Disable */}
                    {isDeletionBlocked && status === 'active' && (
                        <div
                            className={getOptionClasses('disable')}
                            onClick={() => setSelectedOption('disable')}
                        >
                            <Radio value="disable" className="mt-1" />
                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                                        {t('categories.deleteModal.disableOption')}
                                    </span>
                                    <Badge
                                        content="Recommended"
                                        className="bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 border-none rounded-md px-2 py-0 text-[10px] font-bold"
                                    />
                                </div>
                                <p className="text-xs text-neutral-400 leading-relaxed text-start ">
                                    {t('categories.deleteModal.disableDescription')}
                                </p>
                            </div>
                            <Icon
                                name="shieldCheck"
                                className="shrink-0 text-primary-500 dark:text-primary-100"
                            />
                        </div>
                    )}

                    {/* Scenario 1 & 3B: Empty OR (Blocked & Inactive & No SubCategories) -> Show Soft Delete */}
                    {(!isDeletionBlocked ||
                        (isDeletionBlocked &&
                            status !== 'active' &&
                            subCategoriesCount === 0)) && (
                            <div
                                className={getOptionClasses('softDelete')}
                                onClick={() => setSelectedOption('softDelete')}
                            >
                                <Radio value="softDelete" className="mt-1" />
                                <div className="flex-1 text-left">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                                            {t('categories.deleteModal.softDeleteOption')}
                                        </span>
                                        <Badge
                                            content="Recommended"
                                            className="bg-green-100 dark:bg-green-900/30 text-green-500 dark:text-green-400 border-none rounded-md px-2 py-0 text-[10px] font-bold"
                                        />
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed text-start">
                                        {t(
                                            'categories.deleteModal.softDeleteDescription',
                                        )}
                                    </p>
                                </div>
                                <Icon
                                    name="delete"
                                    className="shrink-0 text-primary-500 dark:text-primary-100"
                                />
                            </div>
                        )}



                    <div
                        className={getOptionClasses('move', 'flex-col ')}
                        onClick={() => setSelectedOption('move')}
                    >
                        <div className="flex items-start  gap-4 w-full">
                            <Radio value="move" className="mt-1" />
                            <div className="flex-1 text-start">
                                <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm block mb-1">
                                    {t('categories.deleteModal.bulkMoveOption')}
                                </span>
                                <p className="text-xs text-neutral-400 leading-relaxed ltr:mr-8 rtl:ml-8">
                                    {t(
                                        'categories.deleteModal.bulkMoveDescription',
                                    )}
                                </p>
                            </div>
                            <Icon
                                name="externalLink"
                                className="text-primary-500 dark:text-primary-100"
                            />
                        </div>

                        {selectedOption === 'move' && (
                            <div
                                className="w-full mt-4 pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-700"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <label className="flex items-center gap-2 text-[11px] font-bold text-primary-500 dark:text-primary-100  uppercase tracking-wider mb-2">
                                    <span>
                                        {t(
                                            'categories.deleteModal.destinationLabel',
                                        )}
                                    </span>
                                </label>
                                <CategorySelect
                                    size="sm"
                                    placeholder={t(
                                        'categories.deleteModal.destinationPlaceholder',
                                    )}
                                    maxMenuHeight={110}
                                    value={destinationId}
                                    menuPortalZ={9999}
                                    // level={level}
                                    onChange={(opt) => {
                                        if (Array.isArray(opt)) {
                                            setDestinationId(opt[0] ?? null)
                                        } else {
                                            setDestinationId(opt ?? null)
                                        }
                                    }}
                                    classNames="text-start"
                                />
                            </div>
                        )}
                    </div>
                </Radio.Group>
            </div>

            <div className="mt-8 flex justify-between gap-4">
                <Button
                    variant="plain"
                    onClick={onDialogClose}
                    className="flex-1 rounded-xl text-neutral-400 hover:text-neutral-500 font-bold border border-neutral-100 dark:border-neutral-700 h-12"
                >
                    {t('categories.deleteModal.cancel')}
                </Button>

                <Button
                    variant="solid"
                    color={
                        selectedOption === 'softDelete' ||
                            selectedOption === 'disable'
                            ? 'red'
                            : 'primary'
                    }
                    className="flex-[1.5] rounded-xl h-12 font-bold"
                    onClick={onConfirm}
                    loading={isPending}
                    disabled={isPrimaryDisabled}
                >
                    {selectedOption === 'disable' &&
                        t('categories.deleteModal.confirmDisable')}
                    {selectedOption === 'move' &&
                        t('categories.deleteModal.confirmMove')}
                    {selectedOption === 'softDelete' &&
                        t('categories.deleteModal.confirmSoftDelete')}
                </Button>
            </div>
        </Dialog>
    )
}

export default DeleteCategoryModal
