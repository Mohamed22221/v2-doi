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
import getFixedPriceStatusValidationSchema from './modalStatus/schema'
import { FixedPriceStatusModalProps, FormValues, ModalConfig, ReasonOption } from './modalStatus/types'

const FixedPriceStatusModal = ({
    isOpen,
    onClose,
    type,
    onConfirmSuccess,
}: FixedPriceStatusModalProps) => {
    const { t } = useTranslation()
    const [isPending, setIsPending] = useState(false)

    const rejectionReasons: ReasonOption[] = [
        { label: t('fixedPrice.details.modals.reasons.incorrectCategory'), value: 'incorrect_category' },
        { label: t('fixedPrice.details.modals.reasons.blurryImages'), value: 'blurry_images' },
        { label: t('fixedPrice.details.modals.reasons.missingDescription'), value: 'missing_description' },
        { label: t('fixedPrice.details.modals.reasons.duplicateItem'), value: 'duplicate_item' },
        { label: t('fixedPrice.details.modals.reasons.other'), value: 'other' },
    ]

    const hidingReasons: ReasonOption[] = [
        { label: t('fixedPrice.details.modals.reasons.outOfSeason'), value: 'out_of_season' },
        { label: t('fixedPrice.details.modals.reasons.temporarilyUnavailable'), value: 'temporarily_unavailable' },
        { label: t('fixedPrice.details.modals.reasons.testing'), value: 'testing' },
        { label: t('fixedPrice.details.modals.reasons.other'), value: 'other' },
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
                    title: t('fixedPrice.details.modals.reject.title'),
                    description: t('fixedPrice.details.modals.reject.description'),
                    icon: <Icon name="errorModal" />,
                    reasonLabel: t('fixedPrice.details.modals.reject.reasonLabel'),
                    reasonPlaceholder: t('fixedPrice.details.modals.reject.reasonPlaceholder'),
                    reasons: rejectionReasons,
                    noteLabel: t('fixedPrice.details.modals.reject.noteLabel'),
                    notePlaceholder: t('fixedPrice.details.modals.reject.notePlaceholder'),
                    confirmText: t('fixedPrice.details.modals.reject.confirm'),
                    confirmVariant: 'solid',
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
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'unhide':
                return {
                    title: t('fixedPrice.details.modals.unhide.title'),
                    description: t('fixedPrice.details.modals.unhide.description'),
                    icon: <Icon name="hideModal" />,
                    confirmText: t('fixedPrice.details.modals.unhide.confirm'),
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
                validationSchema={getFixedPriceStatusValidationSchema(t, type)}
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

export default FixedPriceStatusModal
