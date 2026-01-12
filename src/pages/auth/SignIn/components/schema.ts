// E.164 phone regex: starts with +, followed by 1-15 digits

import { isEmail } from '@/components/validation/email'
import { isPhone } from '@/components/validation/phone'
import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getValidationSchema = (t: TFunction) => Yup.object().shape({
    identifier: Yup.string()
        .trim()
        .required(t('auth.errors.emailOrPhoneRequired'))
        .test(
            'email-or-phone',
            t('auth.errors.invalidEmailOrPhone'),
            (value) => {
                if (!value) return false
                return isEmail(value) || isPhone(value)
            },
        ),
    password: Yup.string().required(t('auth.errors.passwordRequired')),
})

export default getValidationSchema