import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getCategoryValidationSchema = (t: TFunction) =>
    Yup.object().shape({
        name: Yup.string()
            .trim()
            .required(t('categories.errors.nameRequired')),

        parentId: Yup.string()
            .nullable()
            .optional(),

        status: Yup.string()
            .oneOf(['active', 'inactive'])
            .required(t('categories.errors.statusRequired')),

        sortOrder: Yup.number()
            .typeError(t('categories.errors.sortOrderNumber'))
            .min(0, t('categories.errors.sortOrderMin'))
            .required(t('categories.errors.sortOrderRequired')),

        image: Yup.string()
            .trim()
            .required(t('categories.errors.imageRequired'))
            .test(
                'is-valid-image-url',
                t('categories.errors.invalidImageUrl'),
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

export default getCategoryValidationSchema
