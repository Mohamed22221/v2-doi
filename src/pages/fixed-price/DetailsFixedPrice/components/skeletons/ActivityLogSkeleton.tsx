import ActivityLogSkeleton from '@/components/skeleton/ActivityLogSkeleton'

/**
 * Activity Log skeleton for Fixed Price details
 * Shows 3 columns (Item, Reason, Created at)
 */
const FixedPriceActivityLogSkeleton = () => {
    return <ActivityLogSkeleton columns={3} rows={3} />
}

export default FixedPriceActivityLogSkeleton
