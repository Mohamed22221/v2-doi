import { ReactNode } from 'react'

export interface StatusReasonOption {
    label: string
    value: string
}

export interface StatusModalConfig {
    title: string
    description: string
    icon: ReactNode
    reasonLabel?: string
    reasonPlaceholder?: string
    reasons?: StatusReasonOption[]
    noteLabel?: string
    notePlaceholder?: string
    confirmText: string
    confirmVariant: 'solid' | 'default' | 'plain' | 'link' | 'twoTone'
    confirmColor: string
    footerText?: string
}
