import React from 'react'
import Skeleton from '@/components/ui/Skeleton'

const PersonalAndShippingCardSkeleton = () => {
    return (
        <div className="rounded-2xl bg-neutral-10 p-6 shadow-primary dark:bg-primary-900 dark:shadow-dark">
            <div className="grid gap-8 md:grid-cols-2">
                
                {/* Personal Information */}
                <div>
                    {/* Title */}
                    <Skeleton height={20} width={160} />

                    <div className="mt-5 space-y-5">
                        {/* Email */}
                        <div className="space-y-2">
                            <Skeleton height={14} width={120} />
                            <Skeleton height={16} width={200} />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Skeleton height={14} width={120} />
                            <Skeleton height={16} width={180} />
                        </div>

                        {/* Registration Date */}
                        <div className="space-y-2">
                            <Skeleton height={14} width={140} />
                            <Skeleton height={16} width={140} />
                        </div>

                        {/* Account Status */}
                        <div className="space-y-2">
                            <Skeleton height={14} width={140} />
                            <Skeleton height={28} width={90} className="rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div>
                    {/* Title */}
                    <Skeleton height={20} width={160} />

                    <div className="mt-5 space-y-5">
                        {/* Full Address */}
                        <div className="space-y-2">
                            <Skeleton height={14} width={120} />
                            <Skeleton height={16} width={220} />
                        </div>

                        {/* City & District */}
                        <div className="space-y-2">
                            <Skeleton height={14} width={140} />
                            <Skeleton height={16} width={180} />
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <Skeleton height={14} width={100} />
                            <Skeleton height={16} width={120} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PersonalAndShippingCardSkeleton
