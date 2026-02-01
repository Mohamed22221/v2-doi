import InfoCardSkeleton from '@/components/skeleton/InfoCardSkeleton'

/**
 * Skeleton for Payment Information section in Orders
 * Shows 3 rows without status pills
 */
const PaymentInformationSkeleton = () => {
    return <InfoCardSkeleton rows={3} statusPillsCount={0} />
}

export default PaymentInformationSkeleton
