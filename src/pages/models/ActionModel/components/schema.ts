import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getModelValidationSchema = (t: TFunction) =>
    Yup.object().shape({
        name: Yup.string()
            .trim()
            .required(t('models.errors.nameRequired')),

        brandId: Yup.string()
            .trim()
            .required(t('models.errors.brandRequired')),

        categoryId: Yup.string()
            .trim()
            .required(t('models.errors.categoryRequired')),

        releaseYear: Yup.mixed()
            .test('is-year', t('models.errors.releaseYearRequired'), (value) => {
                if (value instanceof Date) return !isNaN(value.getFullYear())
                if (typeof value === 'number') return !isNaN(value)
                return false
            })
            .required(t('models.errors.releaseYearRequired')),

        sortOrder: Yup.number()
            .typeError(t('models.errors.sortOrderNumber'))
            .min(0, t('models.errors.sortOrderMin'))
            .required(t('models.errors.sortOrderRequired')),
    })

export default getModelValidationSchema
