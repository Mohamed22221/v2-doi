import { useTranslation } from 'react-i18next'
import ModeSwitcher from './ModeSwitcher'
import DirectionSwitcher from './DirectionSwitcher'
import NavModeSwitcher from './NavModeSwitcher'

export type ThemeConfiguratorProps = {
    callBackClose?: () => void
}

const ThemeConfigurator = ({ callBackClose }: ThemeConfiguratorProps) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col h-full justify-between">
            <div className="flex flex-col gap-y-10 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h6>{t('themeConfigurator.darkMode.title')}</h6>
                        <span>{t('themeConfigurator.darkMode.description')}</span>
                    </div>
                    <ModeSwitcher />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h6>{t('themeConfigurator.direction.title')}</h6>
                        <span>{t('themeConfigurator.direction.description')}</span>
                    </div>
                    <DirectionSwitcher callBackClose={callBackClose} />
                </div>
                <div>
                    <h6 className="mb-3">{t('themeConfigurator.navMode.title')}</h6>
                    <NavModeSwitcher />
                </div>

            </div>

        </div>
    )
}

export default ThemeConfigurator
