import Skeleton from '@/components/ui/Skeleton'
import { FormContainer } from '@/components/ui/Form'

const FormUpdateSkeleton = () => {
    return (
        <FormContainer>
            {/* Avatar */}
            <div>
                <Skeleton width={120} height={15} className="mb-2" />
                <Skeleton width={120} height={15} className="mb-5" />
            </div>
            <div className="mb-6">
                <Skeleton variant="circle" width={96} height={96} />
                <Skeleton className="mt-3" width={180} height={12} />
            </div>

            {/* First / Last name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Skeleton width={120} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                </div>
                <div>
                    <Skeleton width={120} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                </div>
            </div>

            {/* Email / Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <Skeleton width={120} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                </div>
                <div>
                    <Skeleton width={120} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                </div>
            </div>

            {/* Company Name / Contact Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <Skeleton width={120} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                </div>
                <div>
                    <Skeleton width={120} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                </div>
            </div>

            {/* Commercial Registration / Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <Skeleton width={120} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                </div>
                <div>
                    <Skeleton width={120} height={12} className="mb-2" />
                    <Skeleton width="100%" height={40} />
                </div>
            </div>

            {/* Switch */}
            <div className="mt-4">
                <Skeleton width={100} height={12} className="mb-2" />
                <Skeleton width={56} height={24} variant="block" />
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-6">
                <Skeleton width={120} height={40} />
                <Skeleton width={160} height={40} />
            </div>
        </FormContainer>
    )
}

export default FormUpdateSkeleton
