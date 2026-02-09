import BackgroundRounded from "@/components/shared/BackgroundRounded"
import ActivityLogSkeleton from "@/components/shared/loaders/ActivityLogSkeleton"
import InfoCardSkeleton from "@/components/shared/loaders/InfoCardSkeleton"
import { Skeleton } from "@/components/ui"

const DetailsDisputeSkeleton = () => (
    <div className="flex flex-col gap-6">
        <>
            <BackgroundRounded>
                <div className="flex flex-col gap-4 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
                    <div className="space-y-2">
                        <Skeleton height={32} width={200} />
                        <Skeleton height={20} width={150} />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Skeleton height={40} width={100} />
                        <Skeleton height={40} width={120} />
                        <Skeleton height={40} width={140} />
                    </div>
                </div>
            </BackgroundRounded>

            <InfoCardSkeleton rows={4} />
            <InfoCardSkeleton rows={3} />
            <InfoCardSkeleton rows={4} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InfoCardSkeleton rows={3} />
                <InfoCardSkeleton rows={3} />
            </div>
            <ActivityLogSkeleton columns={3} />
        </>

    </div>
)

export default DetailsDisputeSkeleton
