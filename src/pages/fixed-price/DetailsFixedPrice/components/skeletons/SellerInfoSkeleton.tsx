import React from 'react'
import Skeleton from '@/components/ui/Skeleton'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

const SellerInfoSkeleton = () => {
    return (
        <BackgroundRounded>
            <div className="p-6">
                <Skeleton height={20} width={120} className="mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="space-y-2">
                        <Skeleton height={14} width={100} />
                        <Skeleton height={16} width={150} />
                    </div>

                    <div className="space-y-2">
                        <Skeleton height={14} width={100} />
                        <Skeleton height={16} width={180} />
                    </div>

                    <div className="space-y-2">
                        <Skeleton height={14} width={120} />
                        <Skeleton height={16} width={140} />
                    </div>

                    <div className="space-y-2">
                        <Skeleton height={14} width={100} />
                        <Skeleton height={28} width={90} className="rounded-full" />
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default SellerInfoSkeleton
