import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import dayjs from 'dayjs'

const getHallValidationSchema = (t: TFunction) =>
    Yup.object().shape({
        name: Yup.string().trim().required(t('halls.errors.nameRequired')),

        description: Yup.string().trim().optional(),

        regionId: Yup.string()
            .nullable()
            .required(t('locations.cities.modal.errors.regionRequired')),

        categorySelectionType: Yup.string()
            .oneOf(['all', 'specific'])
            .required(),

        categoryIds: Yup.array().when('categorySelectionType', {
            is: 'specific',
            then: (schema) =>
                schema
                    .min(1, t('halls.errors.categoryRequired'))
                    .required(t('halls.errors.categoryRequired')),
            otherwise: (schema) => schema.optional(),
        }),

        coverImage: Yup.string()
            .trim()
            .required(t('halls.errors.imageRequired')),

        visibilityStatus: Yup.string().oneOf(['DRAFT', 'SCHEDULED']).required(),

        hallDate: Yup.date()
            .nullable()
            .when('visibilityStatus', {
                is: 'SCHEDULED',
                then: (schema) =>
                    schema.required(t('halls.errors.hallDateRequired')),
                otherwise: (schema) => schema.nullable().optional(),
            }),

        startingTime: Yup.string()
            .nullable()
            .when('visibilityStatus', {
                is: 'SCHEDULED',
                then: (schema) =>
                    schema
                        .required(t('halls.errors.startingTimeRequired'))
                        .test(
                            'is-future-time',
                            t('halls.errors.startingTimeInPast'),
                            function (value) {
                                const { hallDate } = this.parent
                                if (!hallDate || !value) return true

                                const selectedDate = dayjs(hallDate)
                                const now = dayjs()

                                if (selectedDate.isSame(now, 'day')) {
                                    const [hours, minutes] = value
                                        .split(':')
                                        .map(Number)
                                    const selectedDateTime = selectedDate
                                        .hour(hours)
                                        .minute(minutes)

                                    return selectedDateTime.isAfter(now)
                                }

                                return true
                            },
                        ),
                otherwise: (schema) => schema.nullable().optional(),
            }),

        itemDuration: Yup.number()
            .typeError(t('common.errors.number'))
            .min(1, t('common.errors.min1'))
            .when('visibilityStatus', {
                is: 'SCHEDULED',
                then: (schema) =>
                    schema.required(t('halls.errors.itemDurationRequired')),
                otherwise: (schema) => schema.optional(),
            }),
    })

export default getHallValidationSchema
