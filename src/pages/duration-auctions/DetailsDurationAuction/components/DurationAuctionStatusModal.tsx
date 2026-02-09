import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik } from 'formik'
import {
    Dialog,
    Notification,
    toast,
    Icon,
} from '@/components/ui'

import { ModalHeader, ModalBody, ModalFooter } from '@/components/shared/StatusModal'
import getDurationAuctionStatusValidationSchema from './modalStatus/schema'
import { DurationAuctionStatusModalProps, FormValues, ModalConfig, ReasonOption } from './modalStatus/types'

const DurationAuctionStatusModal = ({
    isOpen,
    onClose,
    type,
    onConfirmSuccess,
}: DurationAuctionStatusModalProps) => {
    const { t } = useTranslation()
    const [isPending, setIsPending] = useState(false)

    const rejectionReasons: ReasonOption[] = [
        { label: t('durationAuctions.details.modals.reasons.incorrectCategory'), value: 'incorrect_category' },
        { label: t('durationAuctions.details.modals.reasons.blurryImages'), value: 'blurry_images' },
        { label: t('durationAuctions.details.modals.reasons.missingDescription'), value: 'missing_description' },
        { label: t('durationAuctions.details.modals.reasons.duplicateItem'), value: 'duplicate_item' },
        { label: t('durationAuctions.details.modals.reasons.other'), value: 'other' },
    ]

    const hidingReasons: ReasonOption[] = [
        { label: t('durationAuctions.details.modals.reasons.outOfSeason'), value: 'out_of_season' },
        { label: t('durationAuctions.details.modals.reasons.temporarilyUnavailable'), value: 'temporarily_unavailable' },
        { label: t('durationAuctions.details.modals.reasons.testing'), value: 'testing' },
        { label: t('durationAuctions.details.modals.reasons.other'), value: 'other' },
    ]

    const initialValues: FormValues = {
        reason: '',
        note: '',
    }

    const onConfirm = async (values: FormValues) => {
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

    const getModalConfig = (): ModalConfig => {
        switch (type) {
            case 'reject':
                return {
                    title: t('durationAuctions.details.modals.reject.title'),
                    description: t('durationAuctions.details.modals.reject.description'),
                    icon: <Icon name="errorModal" />,
                    reasonLabel: t('durationAuctions.details.modals.reject.reasonLabel'),
                    reasonPlaceholder: t('durationAuctions.details.modals.reject.reasonPlaceholder'),
                    reasons: rejectionReasons,
                    noteLabel: t('durationAuctions.details.modals.reject.noteLabel'),
                    notePlaceholder: t('durationAuctions.details.modals.reject.notePlaceholder'),
                    confirmText: t('durationAuctions.details.modals.reject.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'hide':
                return {
                    title: t('durationAuctions.details.modals.hide.title'),
                    description: t('durationAuctions.details.modals.hide.description'),
                    icon: <Icon name="errorModal" />,
                    reasonLabel: t('durationAuctions.details.modals.hide.reasonLabel'),
                    reasonPlaceholder: t('durationAuctions.details.modals.hide.reasonPlaceholder'),
                    reasons: hidingReasons,
                    noteLabel: t('durationAuctions.details.modals.hide.noteLabel'),
                    notePlaceholder: t('durationAuctions.details.modals.hide.notePlaceholder'),
                    footerText: t('durationAuctions.details.modals.hide.footerText'),
                    confirmText: t('durationAuctions.details.modals.hide.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'force_end':
                return {
                    title: t('durationAuctions.details.modals.forceEnd.title'),
                    description: t('durationAuctions.details.modals.forceEnd.description'),
                    icon: <Icon name="errorModal" />,
                    confirmText: t('durationAuctions.details.modals.forceEnd.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'unhide':
                return {
                    title: t('durationAuctions.details.modals.unhide.title'),
                    description: t('durationAuctions.details.modals.unhide.description'),
                    icon: <Icon name="hideModal" />,
                    confirmText: t('durationAuctions.details.modals.unhide.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'primary',
                }
            default:
                return {
                    title: '',
                    description: '',
                    icon: null,
                    confirmText: '',
                    confirmVariant: 'solid',
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
            <Formik
                initialValues={initialValues}
                validationSchema={getDurationAuctionStatusValidationSchema(t, type)}
                onSubmit={onConfirm}
            >
                {({ touched, errors }) => (
                    <Form>
                        <ModalHeader config={config} />
                        <ModalBody
                            showFields={type === 'reject' || type === 'hide'}
                            config={config}
                            touched={touched}
                            errors={errors}
                        />
                        <ModalFooter
                            config={config}
                            onClose={onClose}
                            isPending={isPending}
                        />
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default DurationAuctionStatusModal
