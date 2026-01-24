import Notification from '@/components/ui/Notification'
import Button from '@/components/ui/Button'
import toast from '@/components/ui/toast'
import { themeConfig } from '@/configs/theme.config'
import { useAppSelector } from '@/store'
import { useTranslation } from 'react-i18next'

const CopyButton = () => {
    const theme = useAppSelector((state) => state.theme)
    const { t } = useTranslation()

    const handleCopy = () => {
        const config = {
            ...themeConfig,
            ...theme,
            layout: {
                type: theme.layout.type,
                sideNavCollapse: theme.layout.sideNavCollapse,
            },
            panelExpand: false,
        }

        navigator.clipboard.writeText(JSON.stringify(config, null, 2))

        toast.push(
            <Notification title={t('themeConfigurator.copy.success')} type="success">
                {t('themeConfigurator.copy.instruction')}
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <Button block variant="solid" onClick={handleCopy}>
            {t('themeConfigurator.copy.button')}
        </Button>
    )
}

export default CopyButton
