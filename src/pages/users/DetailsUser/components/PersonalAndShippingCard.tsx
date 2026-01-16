import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import React from 'react'


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
  return (
    <BackgroundRounded  >
      <div className="grid gap-8 md:grid-cols-2 p-6">
        <div>
          <h3 className="text-base font-semibold text-neutral-300">Personal Information</h3>
          <div className="mt-5 space-y-5">
            <InfoRow label="Email Address" value={email} />
            <InfoRow label="Phone Number" value={phone} />
            <InfoRow label="Registration Date" value={registrationDate} />
            <InfoRow label="Account Status" value={accountStatus} />
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-neutral-300">Shipping Address</h3>
          <div className="mt-5 space-y-5">
            <InfoRow label="Full Address" value={fullAddress} />
            <InfoRow label="City & District" value={cityDistrict} />
            <InfoRow label="Country" value={country} />
          </div>
        </div>
      </div>
    </BackgroundRounded>
  )
}

export default PersonalAndShippingCard
