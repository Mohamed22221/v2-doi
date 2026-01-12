// E.164 phone regex: starts with +, followed by 1-15 digits

import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getValidationSchema = (t: TFunction) => Yup.object().shape({
    code: Yup.string()
        .matches(/^\d{4}$/, t('auth.errors.otpRequired'))
        .optional(),
})

export default getValidationSchema
