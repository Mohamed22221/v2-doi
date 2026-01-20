import React from 'react'

type Props = {
  label: string
  value?: React.ReactNode
}

const StatMiniCard = ({ label, value }: Props) => {
  return (
    <div className="rounded-xl bg-neutral-10 p-4 shadow-sm ring-1 ring-neutral-100 dark:bg-neutral-950 dark:ring-neutral-800">
      <p className="text-sm text-neutral-400">{label}</p>
      <div className="mt-1 text-lg font-semibold text-neutral-500 dark:text-neutral-10">
        {value ?? <span className="text-neutral-300">—</span>}
      </div>
    </div>
  )
}

export default StatMiniCard
