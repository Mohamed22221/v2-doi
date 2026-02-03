import { ApiAddress } from '@/api/types/users'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { Badge } from '@/components/ui'
import SectionHeader from '@/components/shared/cards/SectionHeader'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatCityRegion } from '../utils/cityRegionFormatter'
import { formatFullAddress } from '../utils/addressFormatter'

type Props = {
    email?: string
    phone?: string
    isPhoneVerified?: boolean
    isEmailVerified?: boolean
    registrationDate?: string
    accountStatus?: React.ReactNode

    fullAddress?: string
    cityDistrict?: string
    country?: string
    primaryAddress?: ApiAddress
}

const PersonalAndShippingCard = ({
    email,
    phone,
    isPhoneVerified,
    isEmailVerified,
    registrationDate,
    accountStatus,
    country,
    primaryAddress,
}: Props) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="grid gap-8 md:grid-cols-2 p-6">
                <div>
                    <SectionHeader title={t('users.userDetails.personalInfo.title')} />
                    <div className="space-y-5">
                        <InfoRow
                            label={t('users.userDetails.personalInfo.email')}
                            value={
                                <div className="flex flex-wrap items-center gap-2">
                                    {email ? (
                                        <span>{email}</span>
                                    ) : (
                                        <span className="text-neutral-300">
                                            —
                                        </span>
                                    )}
                                    <Badge
                                        content={
                                            isEmailVerified
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
                                    {phone ? (
                                        <span>{phone}</span>
                                    ) : (
                                        <span className="text-neutral-300">
                                            —
                                        </span>
                                    )}
                                    <Badge
                                        content={
                                            isPhoneVerified
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
                            label={t(
                                'users.userDetails.personalInfo.registrationDate',
                            )}
                            value={registrationDate}
                        />
                        <InfoRow
                            label={t(
                                'users.userDetails.personalInfo.accountStatus',
                            )}
                            value={accountStatus}
                        />
                    </div>
                </div>
                {primaryAddress && (
                    <div>
                        <SectionHeader title={t('users.userDetails.shippingAddress.title')} />
                        <div className="space-y-5">
                            <InfoRow
                                label={t(
                                    'users.userDetails.shippingAddress.fullAddress',
                                )}
                                value={formatFullAddress({
                                    address: primaryAddress,
                                    t,
                                })}
                            />
                            <InfoRow
                                label={t(
                                    'users.userDetails.shippingAddress.cityDistrict',
                                )}
                                value={formatCityRegion({
                                    address: primaryAddress,
                                    t,
                                })}
                            />
                            <InfoRow
                                label={t(
                                    'users.userDetails.shippingAddress.country',
                                )}
                                value={country}
                            />
                        </div>
                    </div>
                )}
            </div>
        </BackgroundRounded>
    )
}

export default PersonalAndShippingCard
