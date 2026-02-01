import { Button } from '@/components/ui'
import { ModalConfig } from './types'
import { useTranslation } from 'react-i18next'

interface ModalFooterProps {
    config: ModalConfig
    onClose: () => void
    isPending: boolean
}

const ModalFooter = ({ config, onClose, isPending }: ModalFooterProps) => {
    const { t } = useTranslation()

    return (
        <div className="mt-4 flex gap-3">
            <Button
                variant="default"
                className="flex-1"
                type="button"
                onClick={onClose}
                disabled={isPending}
            >
                {t('common.cancel')}
            </Button>
            <Button
                variant={config.confirmVariant}
                color={config.confirmColor}
                className="flex-1"
                type="submit"
                loading={isPending}
            >
                {config.confirmText}
            </Button>
        </div>
    )
}

export default ModalFooter
