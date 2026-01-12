// E.164 phone regex: starts with +, followed by 1-15 digits

import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    code: Yup.string()
        .matches(/^\d{4}$/, 'Please enter the 4-digit OTP code.')
        .optional(),
})

export default validationSchema
