import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import React from 'react'
import { useTranslation } from 'react-i18next'


type Props = {
  email?: string
  phone?: string
  registrationDate?: string
  accountStatus?: React.ReactNode

  fullAddress?: string
  cityDistrict?: string
  country?: string
}

const PersonalAndShippingCard = ({
  email,
  phone,
  registrationDate,
  accountStatus,
  fullAddress,
  cityDistrict,
  country,
}: Props) => {
  const { t } = useTranslation()
  
  return (
    <BackgroundRounded  >
      <div className="grid gap-8 md:grid-cols-2 p-6">
        <div>
          <h3 className="text-base font-semibold text-neutral-300">{t('users.userDetails.personalInfo.title')}</h3>
          <div className="mt-5 space-y-5">
            <InfoRow label={t('users.userDetails.personalInfo.email')} value={email} />
            <InfoRow label={t('users.userDetails.personalInfo.phone')} value={phone} />
            <InfoRow label={t('users.userDetails.personalInfo.registrationDate')} value={registrationDate} />
            <InfoRow label={t('users.userDetails.personalInfo.accountStatus')} value={accountStatus} />
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-neutral-300">{t('users.userDetails.shippingAddress.title')}</h3>
          <div className="mt-5 space-y-5">
            <InfoRow label={t('users.userDetails.shippingAddress.fullAddress')} value={fullAddress} />
            <InfoRow label={t('users.userDetails.shippingAddress.cityDistrict')} value={cityDistrict} />
            <InfoRow label={t('users.userDetails.shippingAddress.country')} value={country} />
          </div>
        </div>
      </div>
    </BackgroundRounded>
  )
}

export default PersonalAndShippingCard
