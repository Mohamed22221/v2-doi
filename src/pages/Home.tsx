
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import Logo from '@/components/template/Logo'
import { useTranslation } from 'react-i18next'


export default function Home() {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
            <div className="mb-8">
                <Logo
                    mode="dark"
                    type="streamline"
                    logoWidth={150}
                    className="mx-auto flex items-center justify-center"
                />
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 tracking-tight">
                {t('home.welcomeTitle', "Welcome on Board, let's get started with DOUEH!")}
            </h1>

            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                {t('home.welcomeSubtitle')}
            </p>

        </div>
    )
}
