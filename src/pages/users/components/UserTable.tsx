import { useMemo } from 'react'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useUserTableColumns } from './UserTableColumns'
import { UserItem } from '@/api/types/users'
import { useGetAllUsers } from '@/api/hooks/users'
import { useInfiniteRoles } from '@/api/hooks/roles'

export default function UserTable() {
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
                label: 'Status:',
                value: null,
                valueType: 'boolean',
                options: [
                    { label: 'Active', value: true },
                    { label: 'Blocked', value: false },
                ],
                placeholder: 'All Status',
            },
            {
                key: 'roleId',
                label: 'Role:',
                value: null,
                valueType: 'number',
                options: roleOptions,
                placeholder: isLoadingRoles
                    ? 'Loading...'
                    : isRolesError
                      ? 'Failed roles'
                      : 'All Roles',
                loading: isLoadingRoles,
                infinity: {
                    fetchNextPage,
                    hasNextPage,
                    isFetchingNextPage,
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
        ],
    )

    const tableQ = useServerTable({
        pageSize: limit,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    return (
        <ViewTable<UserItem>
            showSearch
            title="Registered Users"
            columns={columns}
            data={users ?? []}
            total={total ?? 0}
            pageSize={tableQ.pageSize}
            searchPlaceholder="Search by user name , email , phone"
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoadingUsers}
            emptyText="No users match your filters."
            onPageChange={tableQ.onPageChange}
            onFilterChange={tableQ.onFilterChange}
            onSearchChange={tableQ.onSearchChange}
            onClearAll={tableQ.clearAll}
            avatarInColumns={[0]}
            requestedPage={tableQ.requestedPage}
            isError={isUsersError}
            errorText={errorMessage ?? ''}
        />
    )
}
