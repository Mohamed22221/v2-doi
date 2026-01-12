import { useTranslation } from 'react-i18next'
import SignInForm from './components/SignInForm'

const SignIn = () => {
    const { t } = useTranslation()

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">{t('auth.login.welcome')}</h3>
                <p>{t('auth.login.subtitle')}</p>
            </div>
            <SignInForm disableSubmit={false} />
        </>
    )
}

export default SignIn
