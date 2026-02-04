import { ReactNode } from 'react'
import * as Yup from 'yup'

export interface OutcomeField {
    name: string
    type: 'select' | 'input' | 'textarea' | 'currency'
    label: string
    placeholder: string
    options?: { label: string; value: string | number }[]
    required?: boolean
}

export interface OutcomeConfig {
    value: string
    label: string
    fields: OutcomeField[]
    helperText: string
    validationSchema: Yup.ObjectSchema<any>
}

export interface ResolveDisputeFormValues {
    outcome: string
    [key: string]: any
}
