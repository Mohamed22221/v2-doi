import { ReactNode } from 'react'

export type ModalType = 'reject'

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

export interface SellerRejectModalProps {
    isOpen: boolean
    onClose: () => void
    id: string
    onConfirmSuccess?: () => void
}

export interface FormValues {
    reason: string
    note: string
}
