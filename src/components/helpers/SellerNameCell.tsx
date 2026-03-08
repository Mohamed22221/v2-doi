import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * Minimum required user structure for SellerNameCell
 */
export interface SellerUser {
    id: string
    firstName?: string | null
    lastName?: string | null
    seller?: {
        businessName?: string | null
    }
}

interface SellerNameCellProps {
    /** The user object containing seller details */
    user?: SellerUser | null
    /** Optional extra classes */
    className?: string
}

/**
 * SellerNameCell Component
 * 
 * Logic:
 * 1. Shows user.seller.businessName if present and not empty.
 * 2. Falls back to "firstName lastName" if businessName is missing.
 * 3. Navigates to /sellers/:id on click.
 */
const SellerNameCell: React.FC<SellerNameCellProps> = ({ user, className = '' }) => {
    const { t } = useTranslation()

    if (!user) {
        return <span className="text-gray-400">{t('common.noDataShort')}</span>
    }

    const { id, firstName, lastName, seller } = user
    const businessName = seller?.businessName

    // Priority: Business Name -> Full Name -> ID (as last resort)
    const displayName = businessName?.trim()
        ? businessName
        : [firstName, lastName].filter(Boolean).join(' ').trim() || id

    return (
        <Link
            to={`/sellers/${id}`}
            className={`font-semibold text-gray-900 dark:text-gray-100 hover:underline hover:text-primary-600 transition-colors leading-snug ${className}`}
        >
            {displayName}
        </Link>
    )
}

export default SellerNameCell
