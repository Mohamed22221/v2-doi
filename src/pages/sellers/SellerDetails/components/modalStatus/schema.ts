import * as Yup from 'yup'
import { TFunction } from 'i18next'

const getSellerRejectValidationSchema = (t: TFunction) => {
    return Yup.object().shape({
        reason: Yup.string().required(t('fixedPrice.details.modals.errors.reasonRequired')),
        note: Yup.string(),
    })
}

export default getSellerRejectValidationSchema
