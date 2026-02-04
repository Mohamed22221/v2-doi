import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik, Field, FieldProps } from 'formik'
import * as Yup from 'yup'
import {
    Dialog,
    Notification,
    toast,
    Select,
} from '@/components/ui'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { ModalHeader, ModalFooter } from '@/components/shared/StatusModal'
import { getResolutionOutcomesConfig } from './config'
import { ResolveDisputeFormValues } from './types'
import Icon from '@/components/ui/Icon/Icon'
import DynamicFormRenderer from './DynamicFormRenderer'

interface ResolveDisputeModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirmSuccess?: () => void
}

const ResolveDisputeModal = ({
    isOpen,
    onClose,
    onConfirmSuccess,
}: ResolveDisputeModalProps) => {
    const { t } = useTranslation()
    const [isPending, setIsPending] = useState(false)

    const outcomes = useMemo(() => getResolutionOutcomesConfig(t), [t])

    const modalConfig = {
        title: t('disputes.details.modals.resolveDispute.title'),
        description: t('disputes.details.modals.resolveDispute.description'),
        icon: <Icon name="errorModal" />,
        confirmText: t('disputes.details.modals.resolveDispute.submit'),
        confirmVariant: 'solid' as const,
        confirmColor: 'primary',
    }

    const initialValues: ResolveDisputeFormValues = {
        outcome: '',
    }

    const onConfirm = async (values: ResolveDisputeFormValues) => {
        setIsPending(true)
        console.log('Resolving dispute with values:', values)
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
                validationSchema={Yup.lazy((values) => {
                    const selectedOutcome = outcomes.find(o => o.value === values.outcome)
                    const baseSchema = Yup.object().shape({
                        outcome: Yup.string().required(t('common.required'))
                    })

                    if (selectedOutcome) {
                        return baseSchema.concat(selectedOutcome.validationSchema)
                    }

                    return baseSchema
                })}
                onSubmit={onConfirm}
            >
                {({ touched, errors, values, setFieldValue }) => (
                    <Form>
                        <ModalHeader config={modalConfig} />

                        <div className="px-3 max-h-[330px] overflow-y-auto">
                            <FormContainer>
                                <FormItem
                                    label={t('disputes.details.modals.resolveDispute.outcome')}
                                    asterisk
                                    invalid={Boolean(touched.outcome && errors.outcome)}
                                    errorMessage={errors.outcome}
                                >
                                    <Field name="outcome">
                                        {({ field, form }: FieldProps) => (
                                            <Select
                                                placeholder={t('disputes.details.modals.resolveDispute.outcomePlaceholder') || 'Select Outcome'}
                                                options={outcomes}
                                                value={outcomes.find(o => o.value === field.value)}
                                                onChange={(option) => {
                                                    // Clear other values when outcome changes
                                                    const prevValues = { ...form.values }
                                                    Object.keys(prevValues).forEach(key => {
                                                        if (key !== 'outcome') {
                                                            form.setFieldValue(key, undefined)
                                                        }
                                                    })
                                                    form.setFieldValue(field.name, option?.value || '')
                                                }}
                                                isClearable
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                {values.outcome && (
                                    <div>
                                        {outcomes.find(o => o.value === values.outcome) && (
                                            <>
                                                <DynamicFormRenderer
                                                    fields={outcomes.find(o => o.value === values.outcome)!.fields}
                                                    touched={touched}
                                                    errors={errors}
                                                />
                                                <p className="text-xs text-neutral-400">
                                                    {outcomes.find(o => o.value === values.outcome)!.helperText}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
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

export default ResolveDisputeModal
