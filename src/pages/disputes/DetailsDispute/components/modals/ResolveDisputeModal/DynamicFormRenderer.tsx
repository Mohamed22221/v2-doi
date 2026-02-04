import React from 'react'
import { Field, FieldProps } from 'formik'
import { Select, Input, Icon } from '@/components/ui'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { OutcomeField } from './types'
import { useTranslation } from 'react-i18next'

interface DynamicFormRendererProps {
    fields: OutcomeField[]
    touched: any
    errors: any
}

const DynamicFormRenderer = ({ fields, touched, errors }: DynamicFormRendererProps) => {
    const { t } = useTranslation()

    return (
        <FormContainer>
            <div className="space-y-1">
                {fields.map((field) => (
                    <FormItem
                        key={field.name}
                        label={field.label}
                        asterisk={field.required}
                        invalid={Boolean(touched[field.name] && errors[field.name])}
                        errorMessage={errors[field.name]}
                    >
                        <Field name={field.name}>
                            {({ field: formikField, form }: FieldProps) => {
                                if (field.type === 'select') {
                                    return (
                                        <Select
                                            placeholder={field.placeholder}
                                            options={field.options}
                                            value={field.options?.find(o => o.value === formikField.value)}
                                            onChange={(option) => form.setFieldValue(formikField.name, option?.value || '')}
                                        />
                                    )
                                }

                                if (field.type === 'textarea') {
                                    return (
                                        <Input
                                            {...formikField}
                                            textArea
                                            placeholder={field.placeholder}
                                            rows={3}
                                        />
                                    )
                                }

                                if (field.type === 'currency') {
                                    return (
                                        <Input
                                            {...formikField}
                                            suffix={<Icon name="riyal" />}
                                            type="number"
                                            placeholder={field.placeholder}
                                            onChange={(e) => {
                                                const val = e.target.value === '' ? '' : Number(e.target.value)
                                                form.setFieldValue(formikField.name, val)
                                            }}
                                        />
                                    )
                                }

                                return (
                                    <Input
                                        {...formikField}
                                        placeholder={field.placeholder}
                                    />
                                )
                            }}
                        </Field>
                    </FormItem>
                ))}
            </div>
        </FormContainer>
    )
}

export default DynamicFormRenderer
