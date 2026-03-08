import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import Table from '@/components/ui/Table'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import EmptyState from '@/components/shared/EmptyState'
import { formatDateTime } from '@/utils/formatDateTime'
import type { ActivityLogItem } from '@/api/types/hall-auctions'
import { getActivityLogTypeKey } from './activity-log-type.labels'

interface Props {
    logs?: ActivityLogItem[]
}

const { Tr, Th, Td, THead, TBody } = Table

const ActivityLog = ({ logs = [] }: Props) => {
    const { t } = useTranslation()

    const columns = useMemo<ColumnDef<ActivityLogItem>[]>(
        () => [
            {
                header: t('liveAuctions.details.event'),
                accessorKey: 'type',
                cell: ({ row }) => (
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {t(getActivityLogTypeKey(row.original.type))}
                    </span>
                ),
            },
            {
                header: t('liveAuctions.details.createdAt'),
                accessorKey: 'createdAt',
                cell: ({ row }) => {
                    const { date, time } = formatDateTime(
                        row.original.createdAt,
                    )
                    return (
                        <span className="text-sm text-gray-500">
                            {date}{' '}
                            <span className="text-xs ml-1 text-neutral-400 font-normal">
                                {time}
                            </span>
                        </span>
                    )
                },
            },
            {
                header: t('liveAuctions.details.reason'),
                accessorKey: 'note',
                cell: ({ row }) => (
                    <span className="text-sm text-gray-500">
                        {row.original.note || '—'}
                    </span>
                ),
            },
        ],
        [t],
    )

    const table = useReactTable({
        data: logs,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <BackgroundRounded>
            <div className="p-6">
                <SectionHeader title={t('liveAuctions.details.activityLog')} />

                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                </Table>

                {logs.length === 0 && <EmptyState text={t('common.noData')} />}
            </div>
        </BackgroundRounded>
    )
}

export default ActivityLog
