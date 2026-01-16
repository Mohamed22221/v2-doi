import StatMiniCard from '@/components/shared/cards/StatMiniCard'
import React from 'react'


type Props = {
  totalSpent?: React.ReactNode
  totalOrders?: React.ReactNode
}

const AccountStatisticsCard = ({ totalSpent, totalOrders }: Props) => {
  return (
    <div className="rounded-2xl bg-neutral-10 p-6 shadow-primary dark:bg-neutral-950 dark:shadow-dark">
      <h3 className="text-base font-semibold text-neutral-300">Account Statistics</h3>

      <div className="mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2">
        <StatMiniCard label="Total Spent" value={totalSpent} />
        <StatMiniCard label="Total Orders" value={totalOrders} />
      </div>
    </div>
  )
}

export default AccountStatisticsCard
