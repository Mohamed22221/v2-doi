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
import getFixedPriceStatusValidationSchema from './schema'
import { FixedPriceStatusModalProps, FormValues, ModalConfig, ReasonOption } from './types'

import { useRejectProduct, useHideProduct, useUnHideProduct } from '@/api/hooks/products'
import { getApiErrorMessage } from '@/api/error'

/**
 * FixedPriceStatusModal Component
 * A reusable modal for handling product status changes: reject, hide, and unhide.
 * It uses Formik for form management and validation.
 */
const FixedPriceStatusModal = ({
    isOpen,
    onClose,
    type,
    id,
    onConfirmSuccess,
}: FixedPriceStatusModalProps) => {
    const { t } = useTranslation()

    // API hooks for different product actions
    const { mutate: rejectProduct, isPending: isRejectPending } = useRejectProduct()
    const { mutate: hideProduct, isPending: isHidePending } = useHideProduct()
    const { mutate: unHideProduct, isPending: isUnHidePending } = useUnHideProduct()

    // Combined pending state for use in the modal footer
    const isPending = isRejectPending || isHidePending || isUnHidePending

    const initialValues: FormValues = {
        reason: '',
        note: '',
    }

    /**
     * Handles successful API response
     */
    const handleSuccess = () => {
        toast.push(
            <Notification
                title={t('common.success')}
                type="success"
            />
        )
        onClose()
        if (onConfirmSuccess) onConfirmSuccess()
    }

    /**
     * Handles API error response
     * @param error - The error object from the API
     */
    const handleError = (error: any) => {
        toast.push(
            <Notification
                title={getApiErrorMessage(error)}
                type="danger"
            />
        )
    }

    /**
     * Form submission handler
     * @param values - The form values including the rejection/hidden reason
     */
    const onConfirm = async (values: FormValues) => {
        switch (type) {
            case 'reject':
                rejectProduct(
                    { id, data: { rejectionReason: values.note } },
                    { onSuccess: handleSuccess, onError: handleError }
                )
                break
            case 'hide':
                hideProduct(
                    { id, data: { hiddenReason: values.note } },
                    { onSuccess: handleSuccess, onError: handleError }
                )
                break
            case 'unhide':
                unHideProduct(id, {
                    onSuccess: handleSuccess,
                    onError: handleError,
                })
                break
        }
    }

    /**
     * Generates the configuration for the Modal (Title, Description, etc.) 
     * based on the current action type.
     */
    const getModalConfig = (): ModalConfig => {
        switch (type) {
            case 'reject':
                return {
                    title: t('fixedPrice.details.modals.reject.title'),
                    description: t('fixedPrice.details.modals.reject.description'),
                    icon: <Icon name="errorModal" />,
                    noteLabel: t('fixedPrice.details.modals.reject.reasonLabel'),
                    notePlaceholder: t('fixedPrice.details.modals.reject.reasonPlaceholder'),
                    confirmText: t('fixedPrice.details.modals.reject.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'hide':
                return {
                    title: t('fixedPrice.details.modals.hide.title'),
                    description: t('fixedPrice.details.modals.hide.description'),
                    icon: <Icon name="errorModal" />,
                    noteLabel: t('fixedPrice.details.modals.hide.reasonLabel'),
                    notePlaceholder: t('fixedPrice.details.modals.hide.reasonPlaceholder'),
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
