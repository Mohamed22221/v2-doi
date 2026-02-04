import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik, Field, FieldProps } from 'formik'
import {
    Dialog,
    Notification,
    toast,
    Select,
} from '@/components/ui'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { ModalHeader, ModalFooter } from '@/components/shared/StatusModal'
import { getRequestEvidenceConfig } from './config'
import { getRequestEvidenceSchema } from './schema'
import { RequestEvidenceFormValues } from './types'
import Icon from '@/components/ui/Icon/Icon'

interface RequestEvidenceModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirmSuccess?: () => void
}

const RequestEvidenceModal = ({
    isOpen,
    onClose,
    onConfirmSuccess,
}: RequestEvidenceModalProps) => {
    const { t } = useTranslation()
    const [isPending, setIsPending] = useState(false)

    const config = getRequestEvidenceConfig(t)
    const modalConfig = {
        title: t('disputes.details.modals.requestEvidence.title'),
        description: t('disputes.details.modals.requestEvidence.description'),
        icon: <Icon name="errorModal" />,
        confirmText: t('disputes.details.modals.requestEvidence.submit'),
        confirmVariant: 'solid' as const,
        confirmColor: 'primary',
    }

    const initialValues: RequestEvidenceFormValues = {
        requestFrom: '',
        evidenceType: '',
        deadline: '',
    }

    const onConfirm = async (values: RequestEvidenceFormValues) => {
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

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={500}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={getRequestEvidenceSchema(t)}
                onSubmit={onConfirm}
            >
                {({ touched, errors, values }) => (
                    <Form>
                        <ModalHeader config={modalConfig} />

                        <div className="px-3 max-h-[330px] overflow-y-auto">
                            <FormContainer>
                                {config.fields.map((field) => (
                                    <FormItem
                                        key={field.name}
                                        label={field.label}
                                        invalid={Boolean(touched[field.name] && errors[field.name])}
                                        errorMessage={errors[field.name]}
                                        asterisk={field.required}
                                    >
                                        <Field name={field.name}>
                                            {({ field: formikField, form }: FieldProps) => (
                                                <Select
                                                    placeholder={field.placeholder}
                                                    options={field.options}
                                                    value={field.options?.find(o => o.value === formikField.value)}
                                                    onChange={(option) => form.setFieldValue(formikField.name, option?.value || '')}
                                                    isClearable
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                ))}
                                <p className="text-xs text-neutral-400">
                                    {config.helperText}
                                </p>
                            </FormContainer>
                        </div>

                        <ModalFooter
                            config={modalConfig}
                            onClose={onClose}
                            isPending={isPending}
                        />
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default RequestEvidenceModal
