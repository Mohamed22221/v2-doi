import * as Yup from 'yup'
import { TFunction } from 'i18next'
import { ModalType } from './types'

const getLiveAuctionStatusValidationSchema = (t: TFunction, type: ModalType) => {
    return Yup.object().shape({
        note: (type === 'reject' || type === 'hide')
            ? Yup.string()
                  .required(t('liveAuctions.details.modals.errors.noteRequired'))
                  .min(5, t('liveAuctions.details.modals.errors.noteMin'))
            : Yup.string(),

    })
}

export default getLiveAuctionStatusValidationSchema
