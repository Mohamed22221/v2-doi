import React from 'react'
import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import StatusPill from '@/components/shared/table/StatusPill'
import DocumentsSection from '@/components/shared/cards/DocumentsSection'
import { getSellerStatusLabel, getSellerStatusVariant } from '../../components/GetSellerStatusLabel'
import { formatDateTime } from '@/utils/formatDateTime'

type Props = {
    data: any // SellerItem
}

const SellerDetailedInfo = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date, time } = formatDateTime(data.createdAt)

    return (
        <BackgroundRounded>
            <div className="grid gap-8 md:grid-cols-2 p-6">
                {/* Personal Information */}
                <div>
                    <h3 className="text-base font-semibold text-neutral-300 uppercase tracking-wider mb-6">
                        {t('fixedPrice.sellers.info.personalInfo')}
                    </h3>
                    <div className="space-y-6">
                        <InfoRow
                            label={t('users.userDetails.personalInfo.email')}
                            value={data.email}
                        />
                        <InfoRow
                            label={t('users.userDetails.personalInfo.phone')}
                            value={data.phone}
                        />
                        <InfoRow
                            label={t('fixedPrice.sellers.info.requestSubmitted')}
                            value={`${date} ${time}`}
                        />
                        <InfoRow
                            label={t('fixedPrice.sellers.info.accountStatus')}
                            value={
                                <StatusPill
                                    variant={getSellerStatusVariant(data.status)}
                                    label={getSellerStatusLabel(data.status)}
                                    size="sm"
                                />
                            }
                        />
                    </div>
                </div>

                {/* Seller Information */}
                <div>
                    <h3 className="text-base font-semibold text-neutral-300 uppercase tracking-wider mb-6">
                        {t('fixedPrice.sellers.info.sellerInfo')}
                    </h3>
                    <div className="space-y-6">
                        <InfoRow
                            label={t('fixedPrice.sellers.info.companyName')}
                            value={data.companyName}
                        />
                        <InfoRow
                            label={t('fixedPrice.sellers.info.contactNumber')}
                            value={data.contactNumber}
                        />
                        <InfoRow
                            label={t('fixedPrice.sellers.info.commercialRegistrationNumber')}
                            value={data.commercialRegistrationNumber}
                        />
                    </div>
                </div>
            </div>
            <DocumentsSection
                title={t('fixedPrice.sellers.documents.title')}
                documents={data.documents}
                t={t}
                documentTitleKey={(type) =>
                    `fixedPrice.sellers.documents.${type === 'commercial_register'
                        ? 'commercialRegister'
                        : 'taxCard'
                    }`
                }
            />
        </BackgroundRounded>
    )
}

export default SellerDetailedInfo
