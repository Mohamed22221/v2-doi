import React from 'react'
import Skeleton from '@/components/ui/Skeleton'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

interface InfoCardSkeletonProps {
    /** Number of info rows to display (default: 3) */
    rows?: number
    /** Whether to show a status pill in the last row(s) (default: 0) */
    statusPillsCount?: number
    /** Whether to wrap in BackgroundRounded (default: true) */
    showBackground?: boolean
    /** Optional title for the card */
    title?: boolean
}

/**
 * Reusable skeleton for info cards with title and grid of info rows
 * Used for: SellerInfo, BuyerInfo, BasicInformation, and similar card layouts
 */
const InfoCardSkeleton = ({
    rows = 3,
    statusPillsCount = 0,
    showBackground = true,
    title = true
}: InfoCardSkeletonProps) => {
    const content = (
        <div className={showBackground ? 'p-6' : ''}>
            {title && <Skeleton height={20} width={120} className="mb-6" />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {Array.from({ length: rows }).map((_, index) => {
                    const isLastRows = index >= rows - statusPillsCount

                    return (
                        <div key={index} className="space-y-2">
                            <Skeleton height={14} width={100} />
                            {isLastRows ? (
                                <Skeleton height={28} width={90} className="rounded-full" />
                            ) : (
                                <Skeleton height={16} width={index % 3 === 0 ? 150 : index % 3 === 1 ? 180 : 140} />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )

    if (showBackground) {
        return <BackgroundRounded>{content}</BackgroundRounded>
    }

    return content
}

export default InfoCardSkeleton
