import * as Yup from 'yup'
import { TFunction } from 'i18next'

export const getRequestEvidenceSchema = (t: TFunction) => Yup.object().shape({
    requestFrom: Yup.string().required(t('common.required') || 'Required'),
    evidenceType: Yup.string().required(t('common.required') || 'Required'),
    deadline: Yup.string().required(t('common.required') || 'Required')
})
