import React from 'react'
import Skeleton from '@/components/ui/Skeleton'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

interface ActivityLogSkeletonProps {
    /** Number of columns in the table (default: 2) */
    columns?: number
    /** Number of rows to display (default: 3) */
    rows?: number
}

/**
 * Reusable skeleton for activity log tables
 * Used for: Order activity logs, Fixed-price activity logs
 */
const ActivityLogSkeleton = ({ columns = 2, rows = 3 }: ActivityLogSkeletonProps) => {
    const columnWidths = [50, 80, 60] // Default widths for headers

    return (
        <BackgroundRounded>
            <div className="p-6">
                <Skeleton height={20} width={120} className="mb-6" />

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                {Array.from({ length: columns }).map((_, index) => (
                                    <th key={index} className="py-3 px-4">
                                        <Skeleton height={12} width={columnWidths[index] || 60} />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {Array.from({ length: rows }).map((_, index) => (
                                <tr key={index}>
                                    {Array.from({ length: columns }).map((_, colIndex) => (
                                        <td key={colIndex} className="py-4 px-4">
                                            <Skeleton
                                                height={14}
                                                width={colIndex === 0 ? 150 : colIndex === 1 ? 120 : 100}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default ActivityLogSkeleton
