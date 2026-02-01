import React from 'react'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoCardSkeleton from '@/components/skeleton/InfoCardSkeleton'

const PricingAndDescriptionSkeleton = () => {
    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                {/* Basic Information */}
                <InfoCardSkeleton rows={2} title={true} showBackground={false} />

                {/* Pricing & Stock */}
                <InfoCardSkeleton rows={2} title={true} showBackground={false} />
            </div>
        </BackgroundRounded>
    )
}

export default PricingAndDescriptionSkeleton
