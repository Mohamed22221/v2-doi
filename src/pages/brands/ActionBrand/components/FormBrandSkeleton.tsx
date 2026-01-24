import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { Skeleton } from '@/components/ui'

const FormBrandSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
                {/* General Information Card */}
                <BackgroundRounded className="px-6">
                    <div className="space-y-4">
                        {/* Names */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>

                        {/* Descriptions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Skeleton className="h-4 w-40 mb-2" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-4 w-40 mb-2" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        </div>
                    </div>
                </BackgroundRounded>

                {/* Media Assets Card */}
                <BackgroundRounded className="px-6">
                    <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton
                            className="w-full rounded-lg h-66"

                        />
                    </div>
                </BackgroundRounded>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-4">
                {/* Publishing Card */}
                <BackgroundRounded className="px-6">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                </BackgroundRounded>

                {/* Classification Card */}
                <BackgroundRounded className="px-6">
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </BackgroundRounded>
            </div>
        </div>
    )
}

export default FormBrandSkeleton
