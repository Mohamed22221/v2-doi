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
import { SellerRejectModalProps as SellerSuspendModalProps, ModalConfig } from './types'

import { useSuspendSeller } from '@/api/hooks/sellers'
import { getApiErrorMessage } from '@/api/error'

const SellerSuspendModal = ({
    isOpen,
    onClose,
    onConfirmSuccess,
    id
}: SellerSuspendModalProps) => {
    const { t } = useTranslation()
    const { mutate: suspendSeller, isPending } = useSuspendSeller()

    const initialValues = {
        reason: '',
    }

    const validationSchema = Yup.object().shape({
        reason: Yup.string().required(t('sellers.errors.reasonRequired')),
    })

    const onConfirm = async (values: { reason: string }) => {
        suspendSeller({
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
        title: t('sellers.details.suspendModal.titleSuspend'),
        description: t('sellers.details.suspendModal.description'),
        icon: <Icon name="errorModal" />,
        confirmText: t('sellers.details.suspendModal.confirmSuspension'),
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
                        <div className="p-2 ">
                            <FormItem
                                asterisk
                                label={t('sellers.details.suspendModal.reasonLabel')}
                                invalid={Boolean(touched.reason && errors.reason)}
                                errorMessage={errors.reason}
                            >
                                <Field name="reason">
                                    {({ field }: FieldProps) => (
                                        <Input
                                            {...field}
                                            textArea
                                            placeholder={t('sellers.details.suspendModal.notePlaceholder')}
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

export default SellerSuspendModal
