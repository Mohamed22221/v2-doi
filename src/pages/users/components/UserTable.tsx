import { useMemo } from 'react'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import { ServerFilterConfig, useServerTable } from '@/utils/hooks/useServerTable'
import { useUserTableColumns } from './UserTableColumns'
import { UserItem } from '@/api/types/users'
import { useGetAllUsers } from '@/api/hooks/users'
import { useGetAllRolesSelect } from '@/api/hooks/roles'

const DEFAULT_PAGE_SIZE = 10

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
    roles,
    isLoading: isLoadingRoles,
    isError: isRolesError,
  } = useGetAllRolesSelect()

  const columns = useUserTableColumns()

  const pageSize = limit ?? DEFAULT_PAGE_SIZE

  const roleOptions = useMemo(
    () =>
      (roles ?? []).map((role) => ({
        label: role.name,
        value: role.id,
      })),
    [roles],
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
          ? 'Loading roles...'
          : isRolesError
            ? 'Failed roles'
            : 'All Roles',
        loading: isLoadingRoles,
        
      },
    ],
    [roleOptions, isLoadingRoles, isRolesError],
  )

  const tableQ = useServerTable({
    pageSize,
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
      searchPlaceholder="Search by user name"
      searchValue={tableQ.searchValue}
      filters={tableQ.filters}
      isLoading={isLoadingUsers}
      emptyText="No users match your filters."
      onClearAll={tableQ.clearAll}
      onSearchChange={tableQ.onSearchChange}
      onFilterChange={tableQ.onFilterChange}
      onPageChange={tableQ.onPageChange}
      avatarInColumns={[0]}
      requestedPage={tableQ.requestedPage}
      isError={isUsersError}
      errorText={errorMessage ?? ''}
    />
  )
}
