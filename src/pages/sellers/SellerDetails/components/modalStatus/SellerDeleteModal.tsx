import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik, Field, FieldProps } from 'formik'
import * as Yup from 'yup'
import {
    Dialog,
    Notification,
    toast,
    Icon,
    Input,
} from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import { ModalHeader, ModalFooter } from '@/components/shared/StatusModal'
import { ModalConfig } from './types'
import { useDeleteSeller } from '@/api/hooks/sellers'
import { getApiErrorMessage } from '@/api/error'

interface SellerDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    id: string
    onConfirmSuccess?: () => void
}

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
        reason: Yup.string().required(t('fixedPrice.details.modals.errors.reasonRequired')),
    })

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
        title: t('fixedPrice.sellers.status.temporaryDelete'),
        description: t('users.userDetails.softDeleteModal.description'),
        icon: <Icon name="errorModal" />,
        confirmText: t('users.userDetails.softDeleteModal.confirm'),
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
                                label={t('users.userDetails.softDeleteModal.reasonLabel')}
                                invalid={Boolean(touched.reason && errors.reason)}
                                errorMessage={errors.reason}
                            >
                                <Field name="reason">
                                    {({ field }: FieldProps) => (
                                        <Input
                                            {...field}
                                            textArea
                                            placeholder={t('users.userDetails.softDeleteModal.reasonPlaceholder')}
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
