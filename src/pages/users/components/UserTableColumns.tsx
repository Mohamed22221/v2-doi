import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import { UserItem } from '@/api/types/users'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'


/* -------- Hook that returns columns -------- */
export function useUserTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<UserItem>[]>(() => {
        return [
            {
                header: t('users.table.columns.name'),
                accessorKey: 'firstName',
                cell: ({ row }) => (
                    <TwoLineText
                        imageSize="sm"
                        image={row.original.image}
                        title={`${row.original.firstName} ${row.original.lastName}`}
                        subtitle={row.original.id}
                        subtitlePrefix={t('users.table.columns.idPrefix')}
                        size="sm"
                    />
                ),
            },
            {
                header: t('users.table.columns.email'),
                accessorKey: 'email',
            },
            {
                header: t('users.table.columns.phone'),
                accessorKey: 'phone',
            },
            {
                header: t('users.table.columns.status'),
                accessorKey: 'isActive',
                cell: ({ row }) => (
                    <StatusPill
                        value={row.original.isActive}
                        activeText={t('users.table.status.active')}
                        inactiveText={t('users.table.status.blocked')}
                        size="sm"
                    />
                ),
            },
            {
                header: t('users.table.columns.registeredDate'),
                accessorKey: 'createdAt',
                cell: ({ row }) => {
                    const { date, time } = formatDateTime(
                        row.original.createdAt,
                    )
                    return (
                        <TwoLineText title={date} subtitle={time} size="sm" />
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="w-[90px]">
                        <Button
                            size="md"
                            shape="circle"
                            onClick={() =>
                                navigate(`/users/${row.original.id}`)
                            }
                        >
                            {t('users.table.actions.view')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
