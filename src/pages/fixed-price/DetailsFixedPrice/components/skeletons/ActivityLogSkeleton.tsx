import React from 'react'
import Skeleton from '@/components/ui/Skeleton'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

const ActivityLogSkeleton = () => {
    return (
        <BackgroundRounded>
            <div className="p-6">
                <Skeleton height={20} width={120} className="mb-6" />

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="py-3 px-4">
                                    <Skeleton height={12} width={50} />
                                </th>
                                <th className="py-3 px-4">
                                    <Skeleton height={12} width={80} />
                                </th>
                                <th className="py-3 px-4">
                                    <Skeleton height={12} width={60} />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {[1, 2, 3].map((i) => (
                                <tr key={i}>
                                    <td className="py-4 px-4">
                                        <Skeleton height={14} width={150} />
                                    </td>
                                    <td className="py-4 px-4">
                                        <Skeleton height={14} width={120} />
                                    </td>
                                    <td className="py-4 px-4">
                                        <Skeleton height={14} width={100} />
                                    </td>
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
