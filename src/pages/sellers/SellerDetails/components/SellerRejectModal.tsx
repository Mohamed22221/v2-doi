import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik, Field, FieldProps } from 'formik'
import * as Yup from 'yup'

// UI Components
import {
    Dialog,
    Notification,
    toast,
    Icon,
    Input,
} from '@/components/ui'
import { FormItem } from '@/components/ui/Form'

// Shared Components
import { ModalHeader, ModalFooter } from '@/components/shared/StatusModal'

// Hooks
import { useRejectSeller } from '@/api/hooks/sellers'
import { getApiErrorMessage } from '@/api/error'

// Types
import { SellerRejectModalProps, ModalConfig } from './modalStatus/types'

/**
 * Modal component for rejecting a seller request
 * Requires a reason for rejection
 */
const SellerRejectModal = ({
    isOpen,
    onClose,
    onConfirmSuccess,
    id
}: SellerRejectModalProps) => {
    const { t } = useTranslation()
    const { mutate: rejectSeller, isPending } = useRejectSeller()

    const initialValues = {
        reason: '',
    }

    const validationSchema = Yup.object().shape({
        reason: Yup.string().required(t('fixedPrice.details.modals.errors.reasonRequired')),
    })

    /**
     * Handles the rejection confirmation
     */
    const onConfirm = async (values: { reason: string }) => {
        rejectSeller({
            userId: id,
            data: { reason: values.reason }
        }, {
            onSuccess: () => {
                toast.push(
                    <Notification
                        title={t('common.success')}
                        type="success"
                    />
                )
                onClose()
                if (onConfirmSuccess) onConfirmSuccess()
            },
            onError: (error) => {
                toast.push(
                    <Notification
                        title={getApiErrorMessage(error)}
                        type="danger"
                    />
                )
            }
        })
    }

    const config: ModalConfig = {
        title: t('sellers.details.modals.reject.title'),
        description: t('sellers.details.modals.reject.description'),
        icon: <Icon name="errorModal" />,
        confirmText: t('sellers.details.modals.reject.confirm'),
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
                validationSchema={validationSchema}
                onSubmit={onConfirm}
            >
                {({ touched, errors }) => (
                    <Form>
                        <ModalHeader config={config} />
                        <div className="p-2">
                            <FormItem
                                asterisk
                                label={t('sellers.details.modals.reject.reasonLabel')}
                                invalid={Boolean(touched.reason && errors.reason)}
                                errorMessage={errors.reason}
                            >
                                <Field name="reason">
                                    {({ field }: FieldProps) => (
                                        <Input
                                            {...field}
                                            textArea
                                            placeholder={t('sellers.details.modals.reject.reasonPlaceholder')}
                                            rows={4}
                                        />
                                    )}
                                </Field>
                            </FormItem>
                        </div>
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
