import InfoCardSkeleton from '@/components/skeleton/InfoCardSkeleton'

/**
 * Skeleton for Buyer Info section
 * Shows 3 rows without status pill
 */
const BuyerInfoSkeleton = () => {
    return <InfoCardSkeleton rows={3} statusPillsCount={0} />
}

export default BuyerInfoSkeleton
