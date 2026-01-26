import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { Skeleton } from '@/components/ui'

const FormModelSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
                {/* General Information Card */}
                <BackgroundRounded className="px-6">
                    <div className="space-y-4 pt-3">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </BackgroundRounded>

                {/* Classification Card */}
                <BackgroundRounded className="px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
                        <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </BackgroundRounded>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-4">
                {/* Publishing Card */}
                <BackgroundRounded className="px-6">
                    <div className="space-y-4 py-3">
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                </BackgroundRounded>
            </div>
        </div>
    )
}

export default FormModelSkeleton
