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
import { useDeleteSeller } from '@/api/hooks/sellers'
import { getApiErrorMessage } from '@/api/error'

// Types
import { ModalConfig } from './types'

interface SellerDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    id: string
    onConfirmSuccess?: () => void
}

/**
 * Modal component for soft deleting a seller
 * Requires a reason for deletion
 */
const SellerDeleteModal = ({
    isOpen,
    onClose,
    onConfirmSuccess,
    id
}: SellerDeleteModalProps) => {
    const { t } = useTranslation()
    const { mutate: deleteSeller, isPending } = useDeleteSeller()

    const initialValues = {
        reason: '',
    }

    const validationSchema = Yup.object().shape({
        reason: Yup.string().required(t('sellers.errors.reasonRequired')),
    })

    /**
     * Handles the deletion confirmation
     */
    const onConfirm = async (values: { reason: string }) => {
        deleteSeller({
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
        title: t('sellers.table.actions.softDelete'),
        description: t('sellers.details.softDeleteModal.description'),
        icon: <Icon name="errorModal" />,
        confirmText: t('sellers.details.softDeleteModal.confirm'),
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
                                label={t('sellers.details.softDeleteModal.reasonLabel')}
                                invalid={Boolean(touched.reason && errors.reason)}
                                errorMessage={errors.reason}
                            >
                                <Field name="reason">
                                    {({ field }: FieldProps) => (
                                        <Input
                                            {...field}
                                            textArea
                                            placeholder={t('sellers.details.softDeleteModal.reasonPlaceholder')}
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

export default SellerDeleteModal
