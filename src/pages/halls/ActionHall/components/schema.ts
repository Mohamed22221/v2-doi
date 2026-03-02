import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getHallValidationSchema = (t: TFunction) =>
    Yup.object().shape({
        name: Yup.string()
            .trim()
            .required(t('halls.errors.nameRequired')),

        description: Yup.string()
            .trim()
            .optional(),

        regionId: Yup.string()
            .nullable()
            .required(t('locations.cities.modal.errors.regionRequired')),

        categorySelectionType: Yup.string()
            .oneOf(['all', 'specific'])
            .required(),

        categoryIds: Yup.array()
            .when('categorySelectionType', {
                is: 'specific',
                then: (schema) => schema.min(1, t('halls.errors.categoryRequired')).required(t('halls.errors.categoryRequired')),
                otherwise: (schema) => schema.optional(),
            }),

        coverImage: Yup.string()
            .trim()
            .required(t('halls.errors.imageRequired')),

        visibilityStatus: Yup.string()
            .oneOf(['DRAFT', 'ARCHIVED'])
            .required(),

        hallDate: Yup.date()
            .nullable()
            .when('visibilityStatus', {
                is: 'ARCHIVED',
                then: (schema) => schema.required(t('halls.errors.hallDateRequired')),
                otherwise: (schema) => schema.nullable().optional(),
            }),

        startingTime: Yup.string()
            .nullable()
            .when('visibilityStatus', {
                is: 'ARCHIVED',
                then: (schema) => schema.required(t('halls.errors.startingTimeRequired')),
                otherwise: (schema) => schema.nullable().optional(),
            }),

        itemDuration: Yup.number()
            .typeError(t('common.errors.number'))
            .min(1, t('common.errors.min1'))
            .when('visibilityStatus', {
                is: 'ARCHIVED',
                then: (schema) => schema.required(t('halls.errors.itemDurationRequired')),
                otherwise: (schema) => schema.optional(),
            }),
    })

export default getHallValidationSchema
