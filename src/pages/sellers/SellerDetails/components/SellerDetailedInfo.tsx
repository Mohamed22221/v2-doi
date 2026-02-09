import React from 'react'
import { useTranslation } from 'react-i18next'

// Shared Components
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import DocumentsSection from '@/components/shared/cards/DocumentsSection'
import StatusPill from '@/components/shared/table/StatusPill'

// UI Components
import { Badge } from '@/components/ui'

// Utils & Helpers
import { formatDateTime } from '@/utils/formatDateTime'
import {
    getAccountStatusLabel,
    getAccountStatusVariant,
    AccountStatus
} from '../../components/GetSellerStatusLabel'

// Types
import { SellerItem } from '@/api/types/sellers'

type Props = {
    data: SellerItem
}

/**
 * Component to display detailed information about a seller
 * Includes: Personal Info, Business Info, and Documents
 */
const SellerDetailedInfo = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date, time } = formatDateTime(data.user.createdAt)

    return (
        <BackgroundRounded>
            <div className="grid gap-8 md:grid-cols-2 p-4 md:p-6">
                {/* Personal Information Section */}
                <div>
                    <SectionHeader title={t('sellers.info.personalInfo')} />
                    <div className="space-y-6">
                        <InfoRow
                            label={t('sellers.details.personalInfo.email')}
                            value={
                                <div className="flex flex-wrap items-center gap-2">
                                    {data.user.email ? (
                                        <span>{data.user.email}</span>
                                    ) : (
                                        <span className="text-neutral-300">
                                            —
                                        </span>
                                    )}
                                    <Badge
                                        content={
                                            data.user.isEmailVerified
                                                ? t(
                                                    'sellers.details.status.verified',
                                                )
                                                : t(
                                                    'sellers.details.status.notVerified',
                                                )
                                        }
                                        innerClass="bg-white text-gray-500"
                                        className="ms-1 border border-gray-400"
                                    />
                                </div>
                            }
                        />
                        <InfoRow
                            label={t('sellers.details.personalInfo.phone')}
                            value={
                                <div className="flex flex-wrap items-center gap-2">
                                    {data.user.phone ? (
                                        <span>{data.user.phone}</span>
                                    ) : (
                                        <span className="text-neutral-300">
                                            —
                                        </span>
                                    )}
                                    <Badge
                                        content={
                                            data.user.isPhoneVerified
                                                ? t(
                                                    'sellers.details.status.verified',
                                                )
                                                : t(
                                                    'sellers.details.status.notVerified',
                                                )
                                        }
                                        innerClass="bg-white text-gray-500"
                                        className="ms-1 border border-gray-400"
                                    />
                                </div>
                            }
                        />
                        <InfoRow
                            label={t('sellers.info.requestSubmitted')}
                            value={`${date} ${time}`}
                        />
                        <InfoRow
                            label={t('sellers.info.accountStatus')}
                            value={
                                <StatusPill
                                    variant={getAccountStatusVariant(data?.accountStatus as AccountStatus)}
                                    label={getAccountStatusLabel(t, data?.accountStatus as AccountStatus)}
                                    size="sm"
                                />
                            }
                        />

                    </div>
                </div>

                {/* Seller/Business Information Section */}
                <div>
                    <SectionHeader
                        title={t('sellers.info.sellerInfo')}
                    />
                    <div className="space-y-6">
                        <InfoRow
                            label={t('sellers.info.companyName')}
                            value={data.businessName}
                        />
                        <InfoRow
                            label={t('sellers.info.contactNumber')}
                            value={data.businessPhone}
                        />
                        <InfoRow
                            label={t('sellers.info.commercialRegistrationNumber')}
                            value={data.commercialRegistrationNumber}
                        />
                        <InfoRow
                            label={t('sellers.info.nationalIdNumber')}
                            value={data.nationalIdNumber}
                        />
                    </div>
                </div>
            </div>

            {/* Seller Documents Section */}
            <DocumentsSection
                title={t('sellers.documents.title')}
                documents={data.documents.map(doc => ({
                    id: `${doc.type}-${doc.uploadedAt}`,
                    type: doc.type,
                    title: doc.notes || doc.type,
                    image: doc.fileUrl,
                    fileUrl: doc.fileUrl
                }))}
                t={t}
                documentTitleKey={(type) =>
                    `sellers.documents.${type === 'commercial_certificate'
                        ? 'commercialCertificate'
                        : type === 'national_id'
                            ? 'nationalId'
                            : 'taxCertificate'
                    }`
                }
            />
        </BackgroundRounded>
    )
}

export default SellerDetailedInfo
