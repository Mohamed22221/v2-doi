import React from 'react'

type Props = {
  label: string
  value?: React.ReactNode
}

const InfoRow = ({ label, value }: Props) => {
  return (
    <div className="space-y-1">
      <p className="text-sm text-primary-500 dark:text-primary-200">{label}</p>
      <div className="text-sm font-medium text-neutral-500 dark:text-neutral-100">
        {value ?? <span className="text-neutral-300">—</span>}
      </div>
    </div>
  )
}

export default InfoRow
