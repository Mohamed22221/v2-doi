import React from 'react'
import Skeleton from '@/components/ui/Skeleton'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

const PricingAndDescriptionSkeleton = () => {
    return (
        <BackgroundRounded>
            <div className="p-6 space-y-8">
                {/* Basic Information */}
                <div>
                    <Skeleton height={20} width={150} className="mb-5" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <div className="space-y-2">
                            <Skeleton height={14} width={100} />
                            <Skeleton height={16} width={200} />
                        </div>
                        <div className="space-y-2">
                            <Skeleton height={14} width={100} />
                            <Skeleton height={40} width="100%" />
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div>
                    <Skeleton height={20} width={150} className="mb-5" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                        <div className="space-y-2">
                            <Skeleton height={14} width={120} />
                            <Skeleton height={16} width={100} />
                        </div>
                        <div className="space-y-2">
                            <Skeleton height={14} width={80} />
                            <Skeleton height={16} width={120} />
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default PricingAndDescriptionSkeleton
