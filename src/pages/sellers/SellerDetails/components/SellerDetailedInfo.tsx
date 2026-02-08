import React from 'react'
import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import StatusPill from '@/components/shared/table/StatusPill'
import { Badge } from '@/components/ui'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import DocumentsSection from '@/components/shared/cards/DocumentsSection'
import {
    getAccountStatusLabel,
    getAccountStatusVariant,
    AccountStatus
} from '../../components/GetSellerStatusLabel'
import { formatDateTime } from '@/utils/formatDateTime'
import { SellerItem } from '@/api/types/sellers'

type Props = {
    data: SellerItem
}

const SellerDetailedInfo = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date, time } = formatDateTime(data.user.createdAt)

    return (
        <BackgroundRounded>
            <div className="grid gap-8 md:grid-cols-2 p-6">
                {/* Personal Information */}
                <div>
                    <SectionHeader title={t('fixedPrice.sellers.info.personalInfo')} />
                    <div className="space-y-6">
                        <InfoRow
                            label={t('users.userDetails.personalInfo.email')}
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
                                                    'users.userDetails.status.verified',
                                                )
                                                : t(
                                                    'users.userDetails.status.notVerified',
                                                )
                                        }
                                        innerClass="bg-white text-gray-500"
                                        className="ms-1 border border-gray-400"
                                    />
                                </div>
                            }
                        />
                        <InfoRow
                            label={t('users.userDetails.personalInfo.phone')}
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
                                                    'users.userDetails.status.verified',
                                                )
                                                : t(
                                                    'users.userDetails.status.notVerified',
                                                )
                                        }
                                        innerClass="bg-white text-gray-500"
                                        className="ms-1 border border-gray-400"
                                    />
                                </div>
                            }
                        />
                        <InfoRow
                            label={t('fixedPrice.sellers.info.requestSubmitted')}
                            value={`${date} ${time}`}
                        />
                        <InfoRow
                            label={t('fixedPrice.sellers.info.accountStatus')}
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

                {/* Seller Information */}
                <div>
                    <SectionHeader
                        title={t('fixedPrice.sellers.info.sellerInfo')}
                    />
                    <div className="space-y-6">
                        <InfoRow
                            label={t('fixedPrice.sellers.info.companyName')}
                            value={data.businessName}
                        />
                        <InfoRow
                            label={t('fixedPrice.sellers.info.contactNumber')}
                            value={data.businessPhone}
                        />
                        <InfoRow
                            label={t('fixedPrice.sellers.info.commercialRegistrationNumber')}
                            value={data.commercialRegistrationNumber}
                        />
                        <InfoRow
                            label={t('fixedPrice.sellers.info.nationalIdNumber')}
                            value={data.nationalIdNumber}
                        />
                    </div>
                </div>
            </div>
            <DocumentsSection
                title={t('fixedPrice.sellers.documents.title')}
                documents={data.documents.map(doc => ({
                    id: `${doc.type}-${doc.uploadedAt}`,
                    type: doc.type,
                    title: doc.notes || doc.type,
                    image: doc.fileUrl,
                    fileUrl: doc.fileUrl
                }))}
                t={t}
                documentTitleKey={(type) =>
                    `fixedPrice.sellers.documents.${type === 'commercial_certificate'
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
