import InfoCardSkeleton from '@/components/shared/loaders/InfoCardSkeleton'

/**
 * Skeleton for Seller Info section
 * Shows 4 rows with a status pill in the last row
 */
const SellerInfoSkeleton = () => {
    return <InfoCardSkeleton rows={4} statusPillsCount={1} />
}

export default SellerInfoSkeleton

