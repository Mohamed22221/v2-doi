import InfoCardSkeleton from '@/components/skeleton/InfoCardSkeleton'

/**
 * Skeleton for Basic Information section in Orders
 * Shows 5 rows with 2 status pills at the end
 */
const BasicInformationSkeleton = () => {
    return <InfoCardSkeleton rows={5} statusPillsCount={2} />
}

export default BasicInformationSkeleton
