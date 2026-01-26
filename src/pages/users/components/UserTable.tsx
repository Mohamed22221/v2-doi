import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useUserTableColumns } from './UserTableColumns'
import { UserItem } from '@/api/types/users'
import { useGetAllUsers } from '@/api/hooks/users'
import { useInfiniteRoles } from '@/api/hooks/roles'
import ServerCsvExportButton from '@/components/shared/ServerCsvExportButton'
import UsersServices from '@/api/services/users'
import { useUserCsvColumns } from './users.csv-columns'

export default function UserTable() {
    const { t } = useTranslation()
    const {
        users,
        isLoading: isLoadingUsers,
        total,
        errorMessage,
        isError: isUsersError,
        limit,
    } = useGetAllUsers()

    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading: isLoadingRoles,
        isError: isRolesError,
        isFetching,
    } = useInfiniteRoles()

    const columns = useUserTableColumns()

    const roleOptions = useMemo(
        () =>
            (data?.items ?? []).map((role) => ({
                label: role.name,
                value: role.id,
            })),
        [data?.items],
    )

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'isActive',
                label: t('users.table.filters.status'),
                value: null,
                valueType: 'boolean',
                options: [
                    { label: t('users.table.status.active'), value: true },
                    { label: t('users.table.status.blocked'), value: false },
                ],
                placeholder: t('users.table.filters.allStatus'),
            },
            {
                key: 'isDeleted',
                label: t('users.table.filters.isDeleted'),
                value: null,
                valueType: 'boolean',
                options: [
                    { label: t('users.table.status.isDeleted'), value: true },
                    { label: t('users.table.status.nonDeleted'), value: false },
                ],
                placeholder: t('users.table.filters.allStatus'),
            },
            {
                key: 'roleId',
                label: t('users.table.filters.role'),
                value: null,
                valueType: 'number',
                options: roleOptions,
                placeholder: isLoadingRoles
                    ? t('users.table.filters.loading')
                    : isRolesError
                      ? t('users.table.filters.failedRoles')
                      : t('users.table.filters.allRoles'),
                infinity: {
                    fetchNextPage,
                    hasNextPage,
                    isFetchingNextPage,
                    isFetching,
                },
            },
        ],
        [
            roleOptions,
            isLoadingRoles,
            isRolesError,
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
            isFetching,
            t,
        ],
    )

    const tableQ = useServerTable({
        pageSize: limit,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const csvColumns = useUserCsvColumns()

    const HeaderActions = () => {
        return (
            <ServerCsvExportButton
                fileNamePrefix="users"
                columns={csvColumns}
                currentData={users}
                serviceMethod={UsersServices.getAllUsers}
            />
        )
    }

    return (
        <ViewTable<UserItem>
            showSearch
            title={t('users.table.title')}
            columns={columns}
            data={users ?? []}
            total={total ?? 0}
            pageSize={tableQ.pageSize}
            searchPlaceholder={t('users.table.searchPlaceholder')}
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoadingUsers}
            emptyText={t('users.table.emptyText')}
            avatarInColumns={[0]}
            requestedPage={tableQ.requestedPage}
            isError={isUsersError}
            errorText={errorMessage ?? ''}
            onPageChange={tableQ.onPageChange}
            onFilterChange={tableQ.onFilterChange}
            onSearchChange={tableQ.onSearchChange}
            onClearAll={tableQ.clearAll}
            headerActions={<HeaderActions />}
            showExportButton={false}
        />
    )
}
