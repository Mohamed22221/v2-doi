import * as Yup from 'yup'
import type { TFunction } from 'i18next'
import { ModalType } from './types'

const getFixedPriceStatusValidationSchema = (t: TFunction, type: ModalType) => {
    return Yup.object().shape({
        reason: type !== 'unhide'
            ? Yup.string().required(t('fixedPrice.details.modals.errors.reasonRequired'))
            : Yup.string().nullable(),
        note: Yup.string().optional(),
    })
}

export default getFixedPriceStatusValidationSchema
