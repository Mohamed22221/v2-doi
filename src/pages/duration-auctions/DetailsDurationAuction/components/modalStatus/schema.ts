import * as Yup from 'yup'
import { TFunction } from 'i18next'
import { ModalType } from './types'

const getDurationAuctionStatusValidationSchema = (t: TFunction, type: ModalType) => {
    return Yup.object().shape({
        reason: (type === 'reject' || type === 'hide')
            ? Yup.string().required(t('durationAuctions.details.modals.errors.reasonRequired'))
            : Yup.string(),
        note: Yup.string(),
    })
}

export default getDurationAuctionStatusValidationSchema
