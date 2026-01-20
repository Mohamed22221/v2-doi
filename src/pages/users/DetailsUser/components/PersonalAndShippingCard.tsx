import { ApiAddress } from '@/api/types/users'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatCityRegion } from '../utils/cityRegionFormatter'
import { formatFullAddress } from '../utils/addressFormatter'

type Props = {
    email?: string
    phone?: string
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
                    <h3 className="text-base font-semibold text-neutral-300">
                        {t('users.userDetails.personalInfo.title')}
                    </h3>
                    <div className="mt-5 space-y-5">
                        <InfoRow
                            label={t('users.userDetails.personalInfo.email')}
                            value={email}
                        />
                        <InfoRow
                            label={t('users.userDetails.personalInfo.phone')}
                            value={phone}
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
                        <h3 className="text-base font-semibold text-neutral-300">
                            {t('users.userDetails.shippingAddress.title')}
                        </h3>
                        <div className="mt-5 space-y-5">
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
