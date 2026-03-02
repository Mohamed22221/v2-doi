import BackgroundRounded from '@/components/shared/BackgroundRounded'
import Skeleton from '@/components/ui/Skeleton'

const HallDetailsSkeleton = () => {
    return (
        <BackgroundRounded>
            <div className="flex flex-col md:flex-row md:mx-4 items-center gap-1">
                <div className="w-[250px] h-[200px] md:w-[250px] md:h-[200px] rounded-[10px] sm:rounded-[12px] overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                    <Skeleton className="w-full h-full" />
                </div>
                <div className="flex flex-col gap-4 p-4 md:gap-2 sm:px-6 sm:py-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Title Skeleton */}
                        <Skeleton
                            height={32}
                            width={240}
                            className="sm:h-8"
                        />
                        {/* Status Label Skeleton */}
                        <Skeleton
                            height={24}
                            width={80}
                            className="rounded-full"
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {/* ID Skeleton */}
                        <Skeleton
                            height={20}
                            width={120}
                        />
                        <span className="text-gray-400">•</span>
                        {/* Description Skeleton */}
                        <Skeleton
                            height={20}
                            width={300}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:gap-3">
                        {/* Action Button Skeleton */}
                        <Skeleton
                            height={40}
                            width={180}
                            className="!rounded-xl w-full sm:w-auto"
                        />
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default HallDetailsSkeleton
