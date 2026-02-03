import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { formatDateTime } from '@/utils/formatDateTime'
import { useTranslation } from 'react-i18next'
import SectionHeader from '@/components/shared/cards/SectionHeader'

interface Props {
    logs?: {
        item: string
        createdAt: string
        reason?: string
    }[]
}

const ActivityLog = ({ logs }: Props) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6">
                <SectionHeader title={t('liveAuctions.details.activityLog')} />

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    {t('liveAuctions.details.logItem')}
                                </th>
                                <th className="py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    {t('liveAuctions.details.createdAt')}
                                </th>
                                <th className="py-3 px-4 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                                    {t('liveAuctions.details.reason')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {logs?.map((log, index) => {
                                const { date, time } = formatDateTime(log.createdAt)
                                return (
                                    <tr key={index}>
                                        <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {log.item}
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            {date} <span className="text-xs ml-1 text-neutral-300 font-normal">{time}</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-500">
                                            {log.reason || '-'}
                                        </td>
                                    </tr>
                                )
                            })}
                            {(!logs || logs.length === 0) && (
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

export default ActivityLog
