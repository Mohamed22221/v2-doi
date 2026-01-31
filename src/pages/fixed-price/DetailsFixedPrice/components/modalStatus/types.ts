import { ReactNode } from 'react'

export type ModalType = 'reject' | 'hide' | 'unhide'

export interface ReasonOption {
    label: string
    value: string
}

export interface ModalConfig {
    title: string
    description: string
    icon: ReactNode
    reasonLabel?: string
    reasonPlaceholder?: string
    reasons?: ReasonOption[]
    noteLabel?: string
    notePlaceholder?: string
    confirmText: string
    confirmVariant: 'solid' | 'default' | 'plain' | 'link' | 'twoTone'
    confirmColor: string
    footerText?: string
}

export interface FixedPriceStatusModalProps {
    isOpen: boolean
    onClose: () => void
    type: ModalType
    id: string
    onConfirmSuccess?: () => void
}

export interface FormValues {
    reason: string
    note: string
}
