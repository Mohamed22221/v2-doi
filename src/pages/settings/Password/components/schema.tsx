import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getValidationSchema = (t: TFunction) => Yup.object().shape({
    oldPassword: Yup.string().required(t('settings.errors.passwordRequired')),
    newPassword: Yup.string()
        .required(t('settings.errors.newPasswordRequired'))
        .min(8, t('settings.errors.passwordTooShort'))
})

export default getValidationSchema
