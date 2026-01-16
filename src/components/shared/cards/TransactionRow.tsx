import React from 'react'

type Props = {
  title: string
  date?: string
  amount?: React.ReactNode
}

const TransactionRow = ({ title, date, amount }: Props) => {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 ring-1 ring-green-100 dark:bg-green-500/10 dark:ring-green-500/20">
          {/* placeholder icon box */}
          <span className="h-4 w-4 rounded bg-green-400/40" />
        </div>

        <div>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-10">
            {title}
          </p>
          {date ? (
            <p className="text-xs text-neutral-300">{date}</p>
          ) : null}
        </div>
      </div>

      <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-10">
        {amount ?? <span className="text-neutral-300">—</span>}
      </div>
    </div>
  )
}

export default TransactionRow
