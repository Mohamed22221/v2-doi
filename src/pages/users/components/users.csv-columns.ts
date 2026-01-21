import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { UserItem } from '@/api/types/users'
import { CsvColumnDef } from '@/utils/csv/csv.utils'

export const useUserCsvColumns = () => {
    const { t } = useTranslation()

    return useMemo<CsvColumnDef<UserItem>[]>(
        () => [
            {
                header: t('users.table.columns.name'),
                accessor: (row: UserItem) => `${row.firstName} ${row.lastName}`,
            },
            {
                header: t('users.table.columns.email'),
                accessor: (row: UserItem) => row.email,
            },
            {
                header: t('users.table.columns.phone'),
                accessor: (row: UserItem) => row.phone,
            },
            {
                header: t('users.table.columns.status'),
                accessor: (row: UserItem) =>
                    row.isActive
                        ? t('users.table.status.active')
                        : t('users.table.status.blocked'),
            },
            {
                header: t('users.table.columns.registeredDate'),
                accessor: (row: UserItem) => row.createdAt,
            },
        ],
        [t],
    )
}
