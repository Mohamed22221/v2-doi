import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Button,
    Dialog,
    Notification,
    toast,
    Input,
    Select,
    Icon,
} from '@/components/ui'

interface FixedPriceStatusModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'reject' | 'hide' | 'unhide'
    id: string
    onConfirmSuccess?: () => void
}

const FixedPriceStatusModal = ({
    isOpen,
    onClose,
    type,
    onConfirmSuccess,
}: FixedPriceStatusModalProps) => {
    const { t } = useTranslation()
    const [reason, setReason] = useState<string | null>(null)
    const [note, setNote] = useState('')
    const [isPending, setIsPending] = useState(false)

    const rejectionReasons = [
        { label: t('fixedPrice.details.modals.reasons.incorrectCategory'), value: 'incorrect_category' },
        { label: t('fixedPrice.details.modals.reasons.blurryImages'), value: 'blurry_images' },
        { label: t('fixedPrice.details.modals.reasons.missingDescription'), value: 'missing_description' },
        { label: t('fixedPrice.details.modals.reasons.duplicateItem'), value: 'duplicate_item' },
    ]

    const hidingReasons = [
        { label: t('fixedPrice.details.modals.reasons.outOfSeason'), value: 'out_of_season' },
        { label: t('fixedPrice.details.modals.reasons.temporarilyUnavailable'), value: 'temporarily_unavailable' },
        { label: t('fixedPrice.details.modals.reasons.testing'), value: 'testing' },
        { label: t('fixedPrice.details.modals.reasons.other'), value: 'other' },
    ]

    const onConfirm = () => {
        setIsPending(true)
        // Simulate API call
        setTimeout(() => {
            setIsPending(false)
            toast.push(
                <Notification
                    title={t('common.success')}
                    type="success"
                />
            )
            onClose()
            if (onConfirmSuccess) onConfirmSuccess()
        }, 1000)
    }

    const getModalConfig = () => {
        switch (type) {
            case 'reject':
                return {
                    title: t('fixedPrice.details.modals.reject.title'),
                    description: t('fixedPrice.details.modals.reject.description'),
                    icon: <Icon name="errorModal" />,
                    reasonLabel: t('fixedPrice.details.modals.reject.reasonLabel'),
                    reasonPlaceholder: t('fixedPrice.details.modals.reject.reasonPlaceholder'),
                    reasons: rejectionReasons,
                    noteLabel: t('fixedPrice.details.modals.reject.noteLabel'),
                    notePlaceholder: t('fixedPrice.details.modals.reject.notePlaceholder'),
                    confirmText: t('fixedPrice.details.modals.reject.confirm'),
                    confirmVariant: 'solid' as const,
                    confirmColor: 'red',
                }
            case 'hide':
                return {
                    title: t('fixedPrice.details.modals.hide.title'),
                    description: t('fixedPrice.details.modals.hide.description'),
                    icon: <Icon name="errorModal" />,
                    reasonLabel: t('fixedPrice.details.modals.hide.reasonLabel'),
                    reasonPlaceholder: t('fixedPrice.details.modals.hide.reasonPlaceholder'),
                    reasons: hidingReasons,
                    noteLabel: t('fixedPrice.details.modals.hide.noteLabel'),
                    notePlaceholder: t('fixedPrice.details.modals.hide.notePlaceholder'),
                    footerText: t('fixedPrice.details.modals.hide.footerText'),
                    confirmText: t('fixedPrice.details.modals.hide.confirm'),
                    confirmVariant: 'solid' as const,
                    confirmColor: 'red',
                }
            case 'unhide':
                return {
                    title: t('fixedPrice.details.modals.unhide.title'),
                    description: t('fixedPrice.details.modals.unhide.description'),
                    icon: <Icon name="hideModal" />,
                    confirmText: t('fixedPrice.details.modals.unhide.confirm'),
                    confirmVariant: 'solid' as const,
                    confirmColor: 'primary',
                }
        }
    }

    const config = getModalConfig()

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={500}
        >
            <div className="flex flex-col items-center p-2">
                {config.icon}
                <h3 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                    {config.title}
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-3 px-4">
                    {config.description}
                </p>

                {(type === 'reject' || type === 'hide') && (
                    <div className="w-full space-y-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {config.reasonLabel}
                            </label>
                            <Select
                                placeholder={config.reasonPlaceholder}
                                options={config.reasons}
                                value={config.reasons?.find(r => r.value === reason)}
                                onChange={(option) => setReason(option?.value || null)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {config.noteLabel}
                            </label>
                            <Input
                                textArea
                                placeholder={config.notePlaceholder}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={4}
                            />
                        </div>
                        {config.footerText && (
                            <p className="text-xs text-gray-400">
                                {config.footerText}
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4 flex gap-3">
                <Button
                    variant="default"
                    className="flex-1"
                    onClick={onClose}
                >
                    {t('fixedPrice.details.modals.reject.cancel')}
                </Button>
                <Button
                    variant={config.confirmVariant}
                    color={config.confirmColor}
                    className="flex-1"
                    onClick={onConfirm}
                    loading={isPending}
                    disabled={(type !== 'unhide' && !reason)}
                >
                    {config.confirmText}
                </Button>
            </div>
        </Dialog>
    )
}

export default FixedPriceStatusModal
