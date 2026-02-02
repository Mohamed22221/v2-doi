import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui'
import { StatusModalConfig } from './types'

interface ModalFooterProps {
    config: StatusModalConfig
    onClose: () => void
    onConfirm?: () => void
    isPending: boolean
}

const ModalFooter = ({ config, onClose, onConfirm, isPending }: ModalFooterProps) => {
    const { t } = useTranslation()

    return (
        <div className="flex justify-end gap-2 p-2 mt-2">
            <Button
                type="button"
                variant="plain"
                size="sm"
                onClick={onClose}
                disabled={isPending}
            >
                {t('common.cancel')}
            </Button>
            <Button
                type={onConfirm ? 'button' : 'submit'}
                variant={config.confirmVariant}
                // size="sm"
                color={config.confirmColor}
                onClick={onConfirm}
                loading={isPending}
            >
                {config.confirmText}
            </Button>
        </div>
    )
}

export default ModalFooter
