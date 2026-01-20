import Skeleton from '@/components/ui/Skeleton'

const RestoreAlertSkeleton = () => {
    return (
        <div className="m-2 rounded-2xl border border-yellow-200 bg-yellow-100 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left side: icon + text */}
                <div className="flex min-w-0 items-start gap-2 sm:items-center">
                    {/* Icon skeleton */}
                    <Skeleton
                        variant="circle"
                        width={22}
                        height={22}
                        className="shrink-0"
                    />

                    {/* Text skeleton */}
                    <Skeleton
                        height={16}
                        width="220px"
                        className="sm:w-[320px]"
                    />
                </div>

                {/* Right side: button */}
                <div className="sm:shrink-0">
                    <Skeleton
                        height={40}
                        width="100%"
                        className="rounded-lg sm:w-[160px]"
                    />
                </div>
            </div>
        </div>
    )
}

export default RestoreAlertSkeleton
