import * as Yup from 'yup'
import { TFunction } from 'i18next'

const getSellerValidationSchema = (t: TFunction, isUpdateMode: boolean) => {
    return Yup.object().shape({
        firstName: Yup.string().required(t('sellers.errors.firstNameRequired')),
        lastName: Yup.string().required(t('sellers.errors.lastNameRequired')),
        email: Yup.string()
            .email(t('sellers.errors.invalidEmail'))
            .required(t('sellers.errors.emailRequired')),
        phone: Yup.string()
            .matches(/^\+?[0-9]{10,15}$/, t('sellers.errors.invalidPhone'))
            .required(t('sellers.errors.phoneRequired')),
        password: isUpdateMode
            ? Yup.string().min(6, t('sellers.errors.passwordMin'))
            : Yup.string()
                .min(6, t('sellers.errors.passwordMin'))
                .required(t('sellers.errors.passwordRequired')),
        isActive: Yup.boolean(),
        image: Yup.string().nullable(),
        businessName: Yup.string().nullable(),
        businessPhone: Yup.string().nullable(),
        commercialRegistrationNumber: Yup.string().nullable(),
    })
}

export default getSellerValidationSchema
