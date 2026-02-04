import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import Button from '@/components/ui/Button'
import { HiArrowLeft } from 'react-icons/hi'
import { useGetDisputeDetails } from '../hooks/useGetDisputeDetails'
import Card from '@/components/ui/Card'
import { formatDateTime } from '@/utils/formatDateTime'
import StatusPill from '@/components/shared/table/StatusPill'
import { getStatusLabel, getStatusVariant } from '../components/GetStatusLabel'

const DetailsDisputePage = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const { data: dispute, isLoading, isError } = useGetDisputeDetails(id || '')

    if (isLoading) {
        return (
            <BackgroundRounded>
                <div className="flex items-center justify-center h-64">
                    <p>{t('common.loading')}</p>
                </div>
            </BackgroundRounded>
        )
    }

    if (isError || !dispute) {
        return (
            <BackgroundRounded>
                <div className="flex items-center justify-center h-64">
                    <p>{t('disputes.details.errors.disputeNotFound')}</p>
                </div>
            </BackgroundRounded>
        )
    }

    const { date: openedDate, time: openedTime } = formatDateTime(dispute.openedAt)

    return (
        <BackgroundRounded>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            size="sm"
                            variant="plain"
                            icon={<HiArrowLeft />}
                            onClick={() => navigate('/disputes')}
                        >
                            {t('common.back')}
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">
                                {t('disputes.details.title')}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.disputeId')}: {dispute.id}
                            </p>
                        </div>
                    </div>
                    <StatusPill
                        variant={getStatusVariant(dispute.status)}
                        label={getStatusLabel(dispute.status)}
                        size="md"
                    />
                </div>

                {/* Basic Information */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4">
                        {t('disputes.details.basicInfo')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.orderId')}
                            </p>
                            <p className="font-medium">{dispute.orderId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.reason')}
                            </p>
                            <p className="font-medium">{dispute.reason}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.openedAt')}
                            </p>
                            <p className="font-medium">{openedDate} {openedTime}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.orderAmount')}
                            </p>
                            <p className="font-medium">{dispute.orderAmount} SAR</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-sm text-gray-500">
                            {t('common.description')}
                        </p>
                        <p className="mt-1">{dispute.description}</p>
                    </div>
                </Card>

                {/* Buyer Info */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4">
                        {t('disputes.details.buyerInfo')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.buyerId')}
                            </p>
                            <p className="font-medium">{dispute.buyerDetails.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.buyerName')}
                            </p>
                            <p className="font-medium">{dispute.buyerDetails.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.phoneNumber')}
                            </p>
                            <p className="font-medium">{dispute.buyerDetails.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.email')}
                            </p>
                            <p className="font-medium">{dispute.buyerDetails.email}</p>
                        </div>
                    </div>
                </Card>

                {/* Seller Info */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4">
                        {t('disputes.details.sellerInfo')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.sellerId')}
                            </p>
                            <p className="font-medium">{dispute.sellerDetails.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.sellerName')}
                            </p>
                            <p className="font-medium">{dispute.sellerDetails.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.phoneNumber')}
                            </p>
                            <p className="font-medium">{dispute.sellerDetails.phone}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">
                                {t('disputes.details.sellerStatus')}
                            </p>
                            <p className="font-medium capitalize">{dispute.sellerDetails.status}</p>
                        </div>
                    </div>
                </Card>

                {/* Activity Log */}
                <Card>
                    <h3 className="text-lg font-semibold mb-4">
                        {t('disputes.details.activityLog')}
                    </h3>
                    <div className="space-y-3">
                        {dispute.activityLog.map((log, index) => {
                            const { date, time } = formatDateTime(log.createdAt)
                            return (
                                <div key={index} className="flex justify-between items-start border-b pb-3 last:border-b-0">
                                    <div className="flex-1">
                                        <p className="font-medium">{log.item}</p>
                                        {log.reason && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                {t('disputes.details.reason')}: {log.reason}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <p>{date}</p>
                                        <p>{time}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </BackgroundRounded>
    )
}

export default DetailsDisputePage
