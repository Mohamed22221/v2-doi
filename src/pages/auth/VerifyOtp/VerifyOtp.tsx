import { useTranslation } from 'react-i18next'
import VerifyOtpForm from './components/VerifyOtpForm'

const VerifyOtp = () => {
    const { t } = useTranslation()

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">{t('auth.verifyOtp.title')}</h3>
                <p>{t('auth.verifyOtp.subtitle')}</p>
            </div>

            <VerifyOtpForm disableSubmit={false} />
        </>
    )
}

export default VerifyOtp
