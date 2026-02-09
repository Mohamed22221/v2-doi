import { RequestEvidenceConfig } from './types'
import { TFunction } from 'i18next'

export const getRequestEvidenceConfig = (t: TFunction): RequestEvidenceConfig => ({
    fields: [
        {
            name: 'requestFrom',
            type: 'select',
            label: t('disputes.details.modals.requestEvidence.requestFrom'),
            placeholder: t('disputes.details.modals.requestEvidence.requestFromPlaceholder') || 'Select Side',
            options: [
                { label: t('common.buyer') || 'Buyer', value: 'buyer' },
                { label: t('common.seller') || 'Seller', value: 'seller' }
            ],
            required: true
        },
        {
            name: 'evidenceType',
            type: 'select',
            label: t('disputes.details.modals.requestEvidence.evidenceType'),
            placeholder: t('disputes.details.modals.requestEvidence.evidenceTypePlaceholder') || 'Select Evidence type',
            options: [
                { label: t('disputes.details.modals.requestEvidence.types.photos') || 'Photos', value: 'photos' },
                { label: t('disputes.details.modals.requestEvidence.types.receipt') || 'Receipt', value: 'receipt' },
                { label: t('disputes.details.modals.requestEvidence.types.shippingProof') || 'Shipping proof', value: 'shipping' }
            ],
            required: true
        },
        {
            name: 'deadline',
            type: 'select',
            label: t('disputes.details.modals.requestEvidence.deadline'),
            placeholder: t('disputes.details.modals.requestEvidence.deadlinePlaceholder') || 'Choose days',
            options: [
                { label: `1 ${t('disputes.details.overview.days')}`, value: '1' },
                { label: `3 ${t('disputes.details.overview.days')}`, value: '3' },
                { label: `7 ${t('disputes.details.overview.days')}`, value: '7' }
            ],
            required: true
        }
    ],
    helperText: t('disputes.details.modals.requestEvidence.helperText')
})
