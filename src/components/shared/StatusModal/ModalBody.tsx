import React from 'react'
import { Field, FieldProps } from 'formik'
import { Select, Input } from '@/components/ui'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { StatusModalConfig } from './types'

interface ModalBodyProps {
    config?: StatusModalConfig
    touched?: Record<string, boolean>
    errors?: Record<string, string>
    showFields?: boolean
    children?: React.ReactNode
}

const ModalBody = ({
    config,
    touched = {},
    errors = {},
    showFields = true,
    children
}: ModalBodyProps) => {
    if (!showFields) {
        return null
    }

    return (
        <FormContainer className="w-full">
            <div className="w-full space-y-1">
                {children}
                {config?.reasonLabel && (
                    <FormItem
                        asterisk
                        label={config.reasonLabel}
                        invalid={Boolean(touched.reason && errors.reason)}
                        errorMessage={errors.reason}
                    >
                        <Field name="reason">
                            {({ field, form }: FieldProps) => (
                                <Select
                                    placeholder={config.reasonPlaceholder}
                                    options={config.reasons}
                                    value={config.reasons?.find(r => r.value === field.value)}
                                    onChange={(option) => form.setFieldValue(field.name, option?.value || '')}
                                    isClearable
                                />
                            )}
                        </Field>
                    </FormItem>
                )}
                {config?.noteLabel && (
                    <FormItem
                        label={config.noteLabel}
                        invalid={Boolean(touched.note && errors.note)}
                        errorMessage={errors.note}
                    >
                        <Field name="note">
                            {({ field }: FieldProps) => (
                                <Input
                                    {...field}
                                    textArea
                                    placeholder={config.notePlaceholder}
                                    rows={4}
                                />
                            )}
                        </Field>
                    </FormItem>
                )}
                {config?.footerText && (
                    <p className="text-xs text-gray-400">
                        {config.footerText}
                    </p>
                )}
            </div>
        </FormContainer>
    )
}

export default ModalBody
