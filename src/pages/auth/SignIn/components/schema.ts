// E.164 phone regex: starts with +, followed by 1-15 digits

import { isEmail } from '@/components/validation/email'
import { isPhone } from '@/components/validation/phone'
import * as Yup from 'yup'


const validationSchema = Yup.object().shape({
    identifier: Yup.string()
        .trim()
        .required('Email or phone number is required')
        .test(
            'email-or-phone',
            'Please enter a valid email or a valid phone number  (+966501234567)',
            (value) => {
                if (!value) return false
                return isEmail(value) || isPhone(value)
            },
        ),
    password: Yup.string().required('Please enter your password'),
})

export default validationSchema