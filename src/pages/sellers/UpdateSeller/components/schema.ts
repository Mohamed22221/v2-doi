import * as Yup from 'yup'
import { TFunction } from 'i18next'

const getSellerValidationSchema = (t: TFunction, isUpdateMode: boolean) => {
    return Yup.object().shape({
        firstName: Yup.string().required(t('users.errors.firstNameRequired')),
        lastName: Yup.string().required(t('users.errors.lastNameRequired')),
        email: Yup.string()
            .email(t('users.errors.invalidEmail'))
            .required(t('users.errors.emailRequired')),
        phone: Yup.string()
            .matches(/^\+?[0-9]{10,15}$/, t('users.errors.invalidPhone'))
            .required(t('users.errors.phoneRequired')),
        password: isUpdateMode
            ? Yup.string().min(6, t('users.errors.passwordMin'))
            : Yup.string()
                .min(6, t('users.errors.passwordMin'))
                .required(t('users.errors.passwordRequired')),
        isActive: Yup.boolean(),
        image: Yup.string().nullable(),
        businessName: Yup.string().nullable(),
        businessPhone: Yup.string().nullable(),
        commercialRegistrationNumber: Yup.string().nullable(),
    })
}

export default getSellerValidationSchema
