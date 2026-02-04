export interface RequestEvidenceFormValues {
    requestFrom: string
    evidenceType: string
    deadline: string
}

export interface RequestEvidenceField {
    name: keyof RequestEvidenceFormValues
    type: 'select' | 'input' | 'textarea'
    label: string
    placeholder: string
    options?: { label: string; value: string | number }[]
    required?: boolean
}

export interface RequestEvidenceConfig {
    fields: RequestEvidenceField[]
    helperText: string
}
