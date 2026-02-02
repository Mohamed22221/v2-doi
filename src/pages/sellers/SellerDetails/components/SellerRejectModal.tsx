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
import getSellerRejectValidationSchema from './modalStatus/schema'
import { SellerRejectModalProps, FormValues, ModalConfig, ReasonOption } from './modalStatus/types'

const SellerRejectModal = ({
    isOpen,
    onClose,
    onConfirmSuccess,
}: SellerRejectModalProps) => {
    const { t } = useTranslation()
    const [isPending, setIsPending] = useState(false)

    const rejectionReasons: ReasonOption[] = [
        { label: t('fixedPrice.details.modals.reasons.incorrectCategory'), value: 'incorrect_category' },
        { label: t('fixedPrice.details.modals.reasons.blurryImages'), value: 'blurry_images' },
        { label: t('fixedPrice.details.modals.reasons.missingDescription'), value: 'missing_description' },
        { label: t('fixedPrice.details.modals.reasons.duplicateItem'), value: 'duplicate_item' },
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

    const config: ModalConfig = {
        title: t('fixedPrice.sellers.details.modals.reject.title'),
        description: t('fixedPrice.sellers.details.modals.reject.description'),
        icon: <Icon name="errorModal" />,
        reasonLabel: t('fixedPrice.sellers.details.modals.reject.reasonLabel'),
        reasonPlaceholder: t('fixedPrice.sellers.details.modals.reject.reasonPlaceholder'),
        reasons: rejectionReasons,
        noteLabel: t('fixedPrice.sellers.details.modals.reject.noteLabel'),
        notePlaceholder: t('fixedPrice.sellers.details.modals.reject.notePlaceholder'),
        footerText: t('fixedPrice.sellers.details.modals.reject.footerText'),
        confirmText: t('fixedPrice.sellers.details.modals.reject.confirm'),
        confirmVariant: 'solid',
        confirmColor: 'red',
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={500}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={getSellerRejectValidationSchema(t)}
                onSubmit={onConfirm}
            >
                {({ touched, errors }) => (
                    <Form>
                        <ModalHeader config={config} />
                        <ModalBody
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

export default SellerRejectModal
