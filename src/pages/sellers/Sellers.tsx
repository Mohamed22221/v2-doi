import React from 'react'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import SellerTable from './components/SellerTable'

/**
 * Main Sellers Page Component
 * Wraps the SellerTable in a rounded background container
 */
const SellersPage = () => {
    return (
        <BackgroundRounded>
            <SellerTable />
        </BackgroundRounded>
    )
}

export default SellersPage
