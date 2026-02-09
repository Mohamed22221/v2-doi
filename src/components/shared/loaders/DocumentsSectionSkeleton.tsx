import Skeleton from '@/components/ui/Skeleton'

const DocumentsSectionSkeleton = () => {
    return (
        <div className="p-4 md:p-6">
            {/* Section Header Skeleton */}
            <Skeleton width="150px" height="20px" className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="p-0 overflow-hidden border border-gray-100 rounded-xl">
                        <div className="p-4 md:p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4 w-full">
                                {/* Icon PlaceHolder */}
                                <Skeleton variant="circle" width={24} height={24} />
                                {/* Title PlaceHolder */}
                                <Skeleton width="40%" height={20} />
                            </div>
                            {/* Button PlaceHolder */}
                            <Skeleton width={32} height={32} />
                        </div>
                        <div className="px-4 md:px-6 pb-4 md:pb-6">
                            {/* Image Placeholder (16/9) */}
                            <div className="aspect-[16/9] w-full">
                                <Skeleton className="w-full h-full rounded-lg" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DocumentsSectionSkeleton
