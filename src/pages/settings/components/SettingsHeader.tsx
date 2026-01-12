import { useTranslation } from 'react-i18next'

const SettingsHeader = () => {
    const { t } = useTranslation()
    return <h3>{t('routes.settings')}</h3>
}

export default SettingsHeader
