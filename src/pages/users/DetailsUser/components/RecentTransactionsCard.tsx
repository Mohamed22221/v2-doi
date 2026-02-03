import TransactionRow from '@/components/shared/cards/TransactionRow'
import React from 'react'
import { useTranslation } from 'react-i18next'
import SectionHeader from '@/components/shared/cards/SectionHeader'

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
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl bg-neutral-10 p-6 shadow-primary dark:bg-neutral-950 dark:shadow-dark">
      <SectionHeader title={t('users.userDetails.recentTransactions.title')} />

      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {transactions.length ? (
          transactions.map((tx, idx) => (
            <TransactionRow
              key={`${tx.title}-${idx}`}
              title={tx.title}
              date={tx.date}
              amount={tx.amount}
            />
          ))
        ) : (
          <div className="py-8 text-sm text-neutral-400">{t('users.userDetails.recentTransactions.emptyText')}</div>
        )}
      </div>

      <button
        type="button"
        onClick={onViewAll}
        className="mt-4 w-full rounded-xl py-3 text-sm font-medium text-primary-700 hover:bg-primary-50 dark:text-primary-200 dark:hover:bg-primary-500/10"
      >
        {t('users.userDetails.recentTransactions.viewAllActivity')}
      </button>
    </div>
  )
}

export default RecentTransactionsCard
