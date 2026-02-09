import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getHallValidationSchema = (t: TFunction) =>
    Yup.object().shape({
        name: Yup.string()
            .trim()
            .required(t('halls.errors.nameRequired')),

        parentId: Yup.string()
            .nullable()
            .optional(),

        status: Yup.string()
            .oneOf(['active', 'achieved', 'hidden'])
            .required(t('halls.errors.statusRequired')),

        sortOrder: Yup.number()
            .typeError(t('common.errors.number'))
            .min(0, t('common.errors.min0'))
            .required(t('halls.errors.sortOrderRequired')),

        image: Yup.string()
            .trim()
            .required(t('halls.errors.imageRequired'))
            .test(
                'is-valid-image-url',
                t('halls.errors.invalidImageUrl'),
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

export default getHallValidationSchema
