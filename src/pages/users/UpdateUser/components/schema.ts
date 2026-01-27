import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import { isEmail } from '@/components/validation/email'
import { isPhone } from '@/components/validation/phone'
import { getPasswordValidation } from '@/components/validation/password'

const getUserValidationSchema = (t: TFunction, isUpdateMode: boolean) =>
    Yup.object().shape({
        firstName: Yup.string()
            .trim()
            .required(t('users.errors.firstNameRequired')),

        lastName: Yup.string()
            .trim()
            .required(t('users.errors.lastNameRequired')),

        email: Yup.string()
            .trim()
            .required(t('users.errors.emailRequired'))
            .test(
                'is-valid-email',
                t('users.errors.invalidEmail'),
                (value) => !!value && isEmail(value),
            ),

        phone: Yup.string()
            .trim()
            .required(t('users.errors.phoneRequired'))
            .test(
                'is-valid-phone',
                t('users.errors.invalidPhone'),
                (value) => !!value && isPhone(value),
            ),

        password: getPasswordValidation(t, isUpdateMode),

        roleId: Yup.number()
            .typeError(t('users.errors.roleRequired'))
            .required(t('users.errors.roleRequired')),

        isActive: Yup.boolean().required(),

        image: Yup.string()
            .trim()
            .required(t('users.errors.imageRequired'))
            .test(
                'is-valid-image-url',
                t('users.errors.invalidImageUrl'),
                (value) => {
                    if (!value) return false

                    const v = value.trim()

                    // ✅ allow absolute http/https OR relative path starting with /
                    const isHttpUrl = /^https?:\/\/.+/i.test(v)
                    const isRelative = /^\/.+/.test(v)

                    if (!isHttpUrl && !isRelative) return false

                    // ✅ optional: ensure it's an image file
                    // remove this block لو backend بيرجع روابط بدون extension
                    const imageExt = /\.(png|jpe?g|webp|gif|bmp|svg)$/i
                    if (!imageExt.test(v)) return true // لو مش عايز تشترط امتداد، خليه true

                    return true
                },
            ),
    })

export default getUserValidationSchema
