import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { formatDateTime } from '@/utils/formatDateTime'
import { useTranslation } from 'react-i18next'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import { DisputeItemDetails } from '@/api/types/disputes'

interface Props {
    data: DisputeItemDetails
}

const ActivityLogCard = ({ data }: Props) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6">
                <SectionHeader title={t('disputes.details.activityLog.title')} />

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    {t('disputes.details.activityLog.item')}
                                </th>
                                <th className="py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    {t('disputes.details.activityLog.createdAt')}
                                </th>
                                <th className="py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    {t('disputes.details.activityLog.reason') || 'Reason'}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {data.activityLog?.map((log, index) => {
                                // Some logs might be just date/time strings from our mock, need to be careful
                                // In the mock we set it as '09/23/2025 10:45 AM'
                                // formatDateTime might need a valid Date input or ISO string
                                return (
                                    <tr key={index}>
                                        <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {log.item}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            {log.createdAt}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            {log.reason || '-'}
                                        </td>
                                    </tr>
                                )
                            })}
                            {(!data.activityLog || data.activityLog.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="py-10 text-center text-neutral-400">
                                        {t('common.noData')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default ActivityLogCard
