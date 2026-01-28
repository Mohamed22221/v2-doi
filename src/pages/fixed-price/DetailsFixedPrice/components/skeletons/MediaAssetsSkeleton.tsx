import React from 'react'
import Skeleton from '@/components/ui/Skeleton'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

const MediaAssetsSkeleton = () => {
    return (
        <BackgroundRounded>
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Skeleton height={40} width={40} className="rounded-lg" />
                    <Skeleton height={24} width={120} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton
                            key={i}
                            className="aspect-square rounded-xl"
                        />
                    ))}
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default MediaAssetsSkeleton
