import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { formatDateTime } from '@/utils/formatDateTime'
import { UserItem } from '@/api/types/users'

/* -------- Item type -------- */


/* -------- Hook that returns columns -------- */
export function useUserTableColumns() {
    const navigate = useNavigate()

    return useMemo<ColumnDef<UserItem>[]>(() => {
        return [
            {
                header: 'Name',
                accessorKey: 'firstName',
                cell: ({ row }) => (
                    <TwoLineText
                        imageSize="sm"
                        image={row.original.image}
                        title={`${row.original.firstName} ${row.original.lastName}`}
                        subtitle={row.original.id}
                        subtitlePrefix="ID:"
                        size="sm"
                    />
                ),
            },
            {
                header: 'Email Address',
                accessorKey: 'email',
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: ({ row }) => (
                    <StatusPill
                        value={row.original.isActive}
                        activeText="Active"
                        inactiveText="Blocked"
                        size="sm"
                    />
                ),
            },
            {
                header: 'Registered Date',
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
                            View
                        </Button>
                    </div>
                ),
            },
        ]
    }, [])
}
