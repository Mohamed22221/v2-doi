import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Formik } from 'formik'
import { Dialog, Notification, toast, Icon } from '@/components/ui'

import {
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@/components/shared/StatusModal'
import getLiveAuctionStatusValidationSchema from './modalStatus/schema'
import {
    LiveAuctionStatusModalProps,
    FormValues,
    ModalConfig,
} from './modalStatus/types'
import {
    useRejectHallItem,
    useHideHallItem,
    useUnhideHallItem,
    useForceEndHallItem,
    useReorderHallItem,
} from '@/api/hooks/live-auctions'
import { getApiErrorMessage } from '@/api/error'

const LiveAuctionStatusModal = ({
    isOpen,
    onClose,
    type,
    id,
    onConfirmSuccess,
}: LiveAuctionStatusModalProps) => {
    const { t } = useTranslation()

    const { mutate: reject, isPending: isRejecting } = useRejectHallItem()
    const { mutate: hide, isPending: isHiding } = useHideHallItem()
    const { mutate: unhide, isPending: isUnhiding } = useUnhideHallItem()
    const { mutate: forceEnd, isPending: isForceEnding } = useForceEndHallItem()
    const { mutate: reorder, isPending: isReordering } = useReorderHallItem()

    const isPending =
        isRejecting || isHiding || isUnhiding || isForceEnding || isReordering

    const initialValues: FormValues = {
        note: '',
    }

    const onConfirm = (values: FormValues) => {
        const onSuccess = () => {
            const successMessages: Record<string, string> = {
                reject: t('liveAuctions.details.errors.rejectSuccess'),
                hide: t('liveAuctions.details.errors.hideSuccess'),
                unhide: t('liveAuctions.details.errors.unhideSuccess'),
                reorder: t('liveAuctions.details.errors.reorderSuccess'),
                force_end: t('liveAuctions.details.errors.forceEndSuccess'),
            }

            toast.push(
                <Notification
                    title={successMessages[type] || t('common.success')}
                    type="success"
                />,
            )
            onClose()
            if (onConfirmSuccess) onConfirmSuccess()
        }

        const onError = (error: unknown) => {
            toast.push(
                <Notification
                    title={getApiErrorMessage(error)}
                    type="danger"
                />,
            )
        }

        switch (type) {
            case 'reject':
                reject(
                    { id, data: { rejectReason: values.note } },
                    { onSuccess, onError },
                )
                break
            case 'hide':
                hide(
                    { id, data: { hiddenReason: values.note } },
                    { onSuccess, onError },
                )
                break
            case 'unhide':
                unhide(id, { onSuccess, onError })
                break
            case 'force_end':
                forceEnd(id, { onSuccess, onError })
                break
            case 'reorder':
                reorder(id, { onSuccess, onError })
                break
        }
    }

    const getModalConfig = (): ModalConfig => {
        switch (type) {
            case 'reject':
                return {
                    title: t('liveAuctions.details.modals.reject.title'),
                    description: t(
                        'liveAuctions.details.modals.reject.description',
                    ),
                    icon: <Icon name="errorModal" />,
                    noteLabel: t(
                        'liveAuctions.details.modals.reject.reasonLabel',
                    ),
                    notePlaceholder: t(
                        'liveAuctions.details.modals.reject.notePlaceholder',
                    ),
                    confirmText: t(
                        'liveAuctions.details.modals.reject.confirm',
                    ),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'hide':
                return {
                    title: t('liveAuctions.details.modals.hide.title'),
                    description: t(
                        'liveAuctions.details.modals.hide.description',
                    ),
                    icon: <Icon name="errorModal" />,
                    noteLabel: t(
                        'liveAuctions.details.modals.hide.reasonLabel',
                    ),
                    notePlaceholder: t(
                        'liveAuctions.details.modals.hide.notePlaceholder',
                    ),
                    footerText: t(
                        'liveAuctions.details.modals.hide.footerText',
                    ),
                    confirmText: t('liveAuctions.details.modals.hide.confirm'),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'force_end':
                return {
                    title: t('liveAuctions.details.modals.forceEnd.title'),
                    description: t(
                        'liveAuctions.details.modals.forceEnd.description',
                    ),
                    icon: <Icon name="errorModal" />,
                    confirmText: t(
                        'liveAuctions.details.modals.forceEnd.confirm',
                    ),
                    confirmVariant: 'solid',
                    confirmColor: 'red',
                }
            case 'unhide':
                return {
                    title: t('liveAuctions.details.modals.unhide.title'),
                    description: t(
                        'liveAuctions.details.modals.unhide.description',
                    ),
                    icon: <Icon name="hideModal" />,
                    confirmText: t(
                        'liveAuctions.details.modals.unhide.confirm',
                    ),
                    confirmVariant: 'solid',
                    confirmColor: 'primary',
                }
            case 'reorder':
                return {
                    title: t('liveAuctions.details.modals.reorder.title'),
                    description: t(
                        'liveAuctions.details.modals.reorder.description',
                    ),
                    icon: <Icon name="hideModal" />,
                    confirmText: t(
                        'liveAuctions.details.modals.reorder.confirm',
                    ),
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
            width={500}
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
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
                            showFields={type === 'reject' || type === 'hide'}
                            config={config}
                            touched={touched}
                            errors={errors}
                        />
                        <ModalFooter
                            config={config}
                            isPending={isPending}
                            onClose={onClose}
                        />
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}

export default LiveAuctionStatusModal
