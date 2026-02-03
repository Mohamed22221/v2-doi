import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getBrandValidationSchema = (t: TFunction) =>
    Yup.object().shape({
        name: Yup.string()
            .trim()
            .required(t('brands.errors.nameRequired')),

        categoryIds: Yup.array()
            .of(Yup.string())
            .min(1, t('brands.errors.categoryRequired'))
            .required(t('brands.errors.categoryRequired')),

        status: Yup.string()
            .oneOf(['active', 'inactive'])
            .required(t('brands.errors.statusRequired')),

        sortOrder: Yup.number()
            .typeError(t('brands.errors.sortOrderNumber'))
            .min(0, t('brands.errors.sortOrderMin'))
            .required(t('brands.errors.sortOrderRequired')),

        logoUrl: Yup.string()
            .trim()
            .required(t('brands.errors.logoRequired'))
            .test(
                'is-valid-logo-url',
                t('brands.errors.invalidLogoUrl'),
                (value) => {
                    if (!value) return false

                    const v = value.trim()

                    // ✅ allow absolute http/https OR relative path starting with /
                    const isHttpUrl = /^https?:\/\/.+/i.test(v)
                    const isRelative = /^\/.+/.test(v)

                    if (!isHttpUrl && !isRelative) return false

                    return true
                },
            ),
    })

export default getBrandValidationSchema
