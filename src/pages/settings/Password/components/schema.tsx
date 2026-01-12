import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Password Required'),
    newPassword: Yup.string()
        .required('Enter your new password')
        .min(8, 'Too Short! Minimum 8 characters')
})
export default validationSchema
