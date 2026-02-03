import StatMiniCard from '@/components/shared/cards/StatMiniCard'
import React from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader from '@/components/shared/cards/SectionHeader'

type Props = {
  totalSpent?: React.ReactNode
  totalOrders?: React.ReactNode
}

const AccountStatisticsCard = ({ totalSpent, totalOrders }: Props) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl bg-neutral-10 p-6 shadow-primary dark:bg-neutral-950 dark:shadow-dark">
      <SectionHeader title={t('users.userDetails.accountStatistics.title')} />

      <div className="grid grid-cols-1 gap-4 xs:grid-cols-2">
        <StatMiniCard label={t('users.userDetails.accountStatistics.totalSpent')} value={totalSpent} />
        <StatMiniCard label={t('users.userDetails.accountStatistics.totalOrders')} value={totalOrders} />
      </div>
    </div>
  )
}

export default AccountStatisticsCard
