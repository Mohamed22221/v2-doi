import * as Yup from 'yup'
import { TFunction } from 'i18next'

export const getPasswordValidation = (t: TFunction, isUpdateMode: boolean = false) => {
    if (isUpdateMode) {
        return Yup.string()
            .test(
                'min-6-if-not-empty',
                t('users.errors.passwordMin'),
                (val) => !val || val.length >= 6,
            )
            .optional()
    }

    return Yup.string()
        .min(6, t('users.errors.passwordMin'))
        .required(t('users.errors.passwordRequired'))
}
