import TransactionRow from '@/components/shared/cards/TransactionRow'
import React from 'react'


type Tx = {
  title: string
  date?: string
  amount?: React.ReactNode
}

type Props = {
  transactions?: Tx[]
  onViewAll?: () => void
}

const RecentTransactionsCard = ({ transactions = [], onViewAll }: Props) => {
  return (
    <div className="rounded-2xl bg-neutral-10 p-6 shadow-primary dark:bg-neutral-950 dark:shadow-dark">
      <h3 className="text-base font-semibold text-neutral-300">Recent Transactions</h3>

      <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
        {transactions.length ? (
          transactions.map((t, idx) => (
            <TransactionRow
              key={`${t.title}-${idx}`}
              title={t.title}
              date={t.date}
              amount={t.amount}
            />
          ))
        ) : (
          <div className="py-8 text-sm text-neutral-400">No transactions.</div>
        )}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="mt-4 w-full rounded-xl py-3 text-sm font-medium text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-500/10"
      >
        View All Activity
      </button>
    </div>
  )
}

export default RecentTransactionsCard
