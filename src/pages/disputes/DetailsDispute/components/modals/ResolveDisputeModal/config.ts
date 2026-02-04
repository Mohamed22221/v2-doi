import { OutcomeConfig } from './types'
import { TFunction } from 'i18next'
import * as Yup from 'yup'

export const getResolutionOutcomesConfig = (t: TFunction): OutcomeConfig[] => [
    {
        value: 'buyer-wins',
        label: t('disputes.details.modals.resolveDispute.outcomes.buyerWins'),
        fields: [
            {
                name: 'refundAmount',
                type: 'currency',
                label: t('disputes.details.modals.resolveDispute.fields.refundAmount'),
                placeholder: t('disputes.details.modals.resolveDispute.fields.refundAmountPlaceholder') || 'Write Amount',
                required: true
            },
            {
                name: 'reason',
                type: 'textarea',
                label: t('disputes.details.modals.resolveDispute.fields.reason'),
                placeholder: t('disputes.details.modals.resolveDispute.fields.reasonPlaceholder') || 'Enter the reason',
                required: true
            }
        ],
        helperText: t('disputes.details.modals.resolveDispute.helpers.buyerWins'),
        validationSchema: Yup.object().shape({
            refundAmount: Yup.number().positive().required(t('common.required')),
            reason: Yup.string().min(10).required(t('common.required'))
        })
    },
    {
        value: 'compensation-type',
        label: t('disputes.details.modals.resolveDispute.outcomes.compensationType'),
        fields: [
            {
                name: 'compensationType',
                type: 'select',
                label: t('disputes.details.modals.resolveDispute.fields.compensationType'),
                placeholder: t('disputes.details.modals.resolveDispute.fields.compensationTypePlaceholder') || 'Select Option',
                options: [
                    { label: t('disputes.details.modals.resolveDispute.options.partialRefund') || 'Partial refund', value: 'partial-refund' },
                    { label: t('disputes.details.modals.resolveDispute.options.returnShipping') || 'Return shipping', value: 'return-shipping' }
                ],
                required: true
            },
            {
                name: 'compensationValue',
                type: 'currency',
                label: t('disputes.details.modals.resolveDispute.fields.compensationValue'),
                placeholder: t('disputes.details.modals.resolveDispute.fields.compensationValuePlaceholder') || 'Write Amount',
                required: true
            }
        ],
        helperText: t('disputes.details.modals.resolveDispute.helpers.compensationType'),
        validationSchema: Yup.object().shape({
            compensationType: Yup.string().required(t('common.required')),
            compensationValue: Yup.number().positive().required(t('common.required'))
        })
    },
    {
        value: 'seller-wins',
        label: t('disputes.details.modals.resolveDispute.outcomes.sellerWins'),
        fields: [
            {
                name: 'reason',
                type: 'textarea',
                label: t('disputes.details.modals.resolveDispute.fields.reason'),
                placeholder: t('disputes.details.modals.resolveDispute.fields.reasonPlaceholder') || 'Enter the reason',
                required: true
            }
        ],
        helperText: t('disputes.details.modals.resolveDispute.helpers.sellerWins'),
        validationSchema: Yup.object().shape({
            reason: Yup.string().min(10).required(t('common.required'))
        })
    }
]
