import InfoCardSkeleton from '@/components/shared/loaders/InfoCardSkeleton'

/**
 * Skeleton for Buyer Info section
 * Shows 3 rows without status pill
 */
const BuyerInfoSkeleton = () => {
    return <InfoCardSkeleton rows={3} statusPillsCount={0} />
}

export default BuyerInfoSkeleton

