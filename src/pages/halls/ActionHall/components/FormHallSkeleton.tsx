import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { Skeleton } from '@/components/ui'

const FormHallSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - General Information & Media Assets (lg:col-span-2) */}
            <div className="lg:col-span-2 space-y-4">
                <BackgroundRounded className="px-6 pb-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-6 rounded-full" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>

                    <div className="space-y-4">
                        {/* Hall Name */}
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>

                        {/* Region */}
                        <div>
                            <Skeleton className="h-4 w-20 mb-2" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>

                        {/* Description */}
                        <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-32 w-full rounded-xl" />
                        </div>
                    </div>
                </BackgroundRounded>

                <BackgroundRounded className="px-6 pb-6">
                    <div className="flex items-center gap-2 py-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-6 w-40" />
                    </div>
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-64 w-full rounded-xl" />
                    </div>
                </BackgroundRounded>
            </div>

            {/* Right Column - Publishing & Classification (lg:col-span-1) */}
            <div className="lg:col-span-1 space-y-4">
                {/* Time Section Skeleton */}
                <BackgroundRounded className="px-6 pb-6">
                    <div className="flex items-center gap-2 py-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-6 w-24" />
                    </div>
                    <div className="space-y-4">
                        {/* Hall Date */}
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                        {/* Starting Time */}
                        <div>
                            <Skeleton className="h-4 w-28 mb-2" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                        {/* Item Duration */}
                        <div>
                            <Skeleton className="h-4 w-28 mb-2" />
                            <Skeleton className="h-11 w-full rounded-xl" />
                        </div>
                    </div>
                </BackgroundRounded>

                {/* Classification Card */}
                <BackgroundRounded className="px-6 pb-6">
                    <div className="flex items-center gap-2 py-4 border-b border-gray-100 dark:border-gray-700 mb-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <div className="space-y-4">
                        {/* All Categories Option */}
                        <div className="border rounded-xl p-4 flex items-center gap-4">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                        </div>
                        {/* Specific Categories Option */}
                        <div className="border rounded-xl p-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-5 w-5 rounded-full" />
                                <Skeleton className="h-5 w-40" />
                            </div>
                        </div>
                    </div>
                </BackgroundRounded>
            </div>
        </div>
    )
}

export default FormHallSkeleton
