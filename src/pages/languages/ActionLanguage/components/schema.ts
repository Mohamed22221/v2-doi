import * as Yup from 'yup'
import type { TFunction } from 'i18next'

const getLanguageValidationSchema = (t: TFunction) =>
    Yup.object().shape({
        name: Yup.string()
            .trim()
            .required(t('languages.errors.nameRequired')),
        code: Yup.string()
            .trim()
            .required(t('languages.errors.codeRequired')),
        isActive: Yup.boolean().required(),
    })

export default getLanguageValidationSchema
