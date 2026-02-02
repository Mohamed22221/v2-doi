import BackgroundRounded from '@/components/shared/BackgroundRounded'
import Skeleton from '@/components/ui/Skeleton'
import React from 'react'

const UserInfoSkeleton = () => {
    return (
        <BackgroundRounded>
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                
                {/* Left Side */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    
                    {/* Avatar Skeleton */}
                    <div className="relative">
                        <Skeleton
                            variant="circle"
                            width={80}
                            height={80}
                            className="sm:!w-[100px] sm:!h-[100px]"
                        />

                        {/* Status Dot */}
                        <Skeleton
                            variant="circle"
                            width={20}
                            height={20}
                            className="absolute bottom-2 right-0 border-2 border-white"
                        />
                        
                    </div>

                    {/* User Info Skeleton */}
                    <div className="w-full text-center sm:text-left">
                        
                        {/* Name + Status */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <Skeleton height={24} width={160} />
                            <Skeleton height={20} width={80} />
                        </div>

                        {/* Account ID */}
                        <div className="mt-2 flex justify-center sm:justify-start">
                            <Skeleton height={16} width={200} />
                        </div>

                        {/* Meta Info */}
                        <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:gap-4">
                            <Skeleton height={14} width={140} />
                            <Skeleton height={14} width={140} />
                        </div>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex w-full flex-col gap-3 sm:w-auto items-center sm:flex-row sm:justify-end">
                    <Skeleton height={40} width={150} />
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default UserInfoSkeleton
