import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { Skeleton } from '@/components/ui'

const FormLanguageSkeleton = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
                <BackgroundRounded className="px-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-48 mb-4" />
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
                <BackgroundRounded className="px-6">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                </BackgroundRounded>
            </div>
        </div>
    )
}

export default FormLanguageSkeleton
