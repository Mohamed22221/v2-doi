import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik } from 'formik'
import {
    Dialog,
    Notification,
    toast,
    Icon,
} from '@/components/ui'

import ModalHeader from './modalStatus/ModalHeader'
import ModalBody from './modalStatus/ModalBody'
import ModalFooter from './modalStatus/ModalFooter'
import getLiveAuctionStatusValidationSchema from './modalStatus/schema'
import { LiveAuctionStatusModalProps, FormValues, ModalConfig, ReasonOption } from './modalStatus/types'

const LiveAuctionStatusModal = ({
    isOpen,
    onClose,
    type,
    onConfirmSuccess,
}: LiveAuctionStatusModalProps) => {
    const { t } = useTranslation()
    const [isPending, setIsPending] = useState(false)

    const rejectionReasons: ReasonOption[] = [
        { label: t('liveAuctions.details.modals.reasons.incorrectCategory'), value: 'incorrect_category' },
        { label: t('liveAuctions.details.modals.reasons.blurryImages'), value: 'blurry_images' },
        { label: t('liveAuctions.details.modals.reasons.missingDescription'), value: 'missing_description' },
        { label: t('liveAuctions.details.modals.reasons.duplicateItem'), value: 'duplicate_item' },
        { label: t('liveAuctions.details.modals.reasons.other'), value: 'other' },
    ]

    const hidingReasons: ReasonOption[] = [
        { label: t('liveAuctions.details.modals.reasons.outOfSeason'), value: 'out_of_season' },
        { label: t('liveAuctions.details.modals.reasons.temporarilyUnavailable'), value: 'temporarily_unavailable' },
        { label: t('liveAuctions.details.modals.reasons.testing'), value: 'testing' },
        { label: t('liveAuctions.details.modals.reasons.other'), value: 'other' },
    ]

    const initialValues: FormValues = {
        reason: '',
        note: '',
    }

    const onConfirm = async (values: FormValues) => {
        setIsPending(true)
        // Simulate API call
        setTimeout(() => {
            setIsPending(false)
            toast.push(
                <Notification
                    title={t('common.success')}
                    type="success"
                />
            )
            onClose()
            if (onConfirmSuccess) onConfirmSuccess()
        }, 1000)
    }

    const getModalConfig = (): ModalConfig => {
        switch (type) {
            case 'reject':
                return {
                    title: t('liveAuctions.details.modals.reject.title'),
                    description: t('liveAuctions.details.modals.reject.description'),
                    icon: <Icon name="errorModal" />,
                    reasonLabel: t('liveAuctions.details.modals.reject.reasonLabel'),
                    reasonPlaceholder: t('liveAuctions.details.modals.reject.reasonPlaceholder'),
                    reasons: rejectionReasons,
                    noteLabel: t('liveAuctions.details.modals.reject.noteLabel'),
                    notePlaceholder: t('liveAuctions.details.modals.reject.notePlaceholder'),
                    confirmText: t('liveAuctions.details.modals.reject.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'hide':
                return {
                    title: t('liveAuctions.details.modals.hide.title'),
                    description: t('liveAuctions.details.modals.hide.description'),
                    icon: <Icon name="errorModal" />,
                    reasonLabel: t('liveAuctions.details.modals.hide.reasonLabel'),
                    reasonPlaceholder: t('liveAuctions.details.modals.hide.reasonPlaceholder'),
                    reasons: hidingReasons,
                    noteLabel: t('liveAuctions.details.modals.hide.noteLabel'),
                    notePlaceholder: t('liveAuctions.details.modals.hide.notePlaceholder'),
                    footerText: t('liveAuctions.details.modals.hide.footerText'),
                    confirmText: t('liveAuctions.details.modals.hide.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'force_end':
                return {
                    title: t('liveAuctions.details.modals.forceEnd.title'),
                    description: t('liveAuctions.details.modals.forceEnd.description'),
                    icon: <Icon name="errorModal" />,
                    confirmText: t('liveAuctions.details.modals.forceEnd.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'unhide':
                return {
                    title: t('liveAuctions.details.modals.unhide.title'),
                    description: t('liveAuctions.details.modals.unhide.description'),
                    icon: <Icon name="hideModal" />,
                    confirmText: t('liveAuctions.details.modals.unhide.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'primary',
                }
            default:
                return {
                    title: '',
                    description: '',
                    icon: null,
                    confirmText: '',
                    confirmVariant: 'solid',
                    confirmColor: 'primary',
                }
        }
    }

    const config = getModalConfig()

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={500}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={getLiveAuctionStatusValidationSchema(t, type)}
                onSubmit={onConfirm}
            >
                {({ touched, errors }) => (
                    <Form>
                        <ModalHeader config={config} />
                        <ModalBody
                            type={type}
                            config={config}
                            touched={touched}
                            errors={errors}
                        />
                        <ModalFooter
                            config={config}
                            onClose={onClose}
                            isPending={isPending}
                        />
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default LiveAuctionStatusModal
