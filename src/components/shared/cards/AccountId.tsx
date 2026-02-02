import React from 'react'
import { useTranslation } from 'react-i18next'

type AccountIdProps = {
    id: string | number
    className?: string
    label?: string
}

const AccountId = ({ id, className = '', label }: AccountIdProps) => {
    const { t } = useTranslation()

    return (
        <div className={`mt-1 flex items-center justify-center gap-1 sm:justify-start ${className}`}>
            <p className="text-primary-500 dark:text-primary-200 text-sm">
                {label || t('users.userDetails.accountId')}:
            </p>
            <span className="font-medium text-black dark:text-white text-sm">
                {id}
            </span>
        </div>
    )
}

export default AccountId
