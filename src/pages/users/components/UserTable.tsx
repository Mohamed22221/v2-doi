import {  useMemo } from 'react'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useUserTableColumns } from './UserTableColumns'
import { UserItem } from '@/api/types/users'
import { useGetAllUsers } from '@/api/hooks/users'

export default function UserTable() {
    const { users, isLoading , total, errorMessage , isError ,  page , limit} = useGetAllUsers()
    console.log(total)
    const columns = useUserTableColumns()
    const initialFilters: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'isActive',
                label: 'Status:',
                value: '',
                valueType: 'boolean',
                options: [
                    { label: 'Active', value: true },
                    { label: 'Blocked', value: false },
                ],
                placeholder: 'All Status',
            },
            {
                key: 'roleId',
                label: 'Role Id:',
                value: '',
                valueType: 'number',
                options: [
                    { label: 'role 1', value: 1 },
                    { label: 'role 2', value: 2 },
                ],
                placeholder: 'All Roles',
            },
        ],
        [],
    )
   
    const tableQ = useServerTable({
        pageSize: limit,
        initialFilters,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })


    return (
        <ViewTable<UserItem>
            showSearch
            title="Registered Users"
            columns={columns}
            data={users}
            total={total}
            currentPage={page}
            pageSize={tableQ.pageSize}
            searchPlaceholder="Search by user name, user ID, email"
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoading}
            emptyText={"No users match your filters."}
            onClearAll={tableQ.clearAll}
            onSearchChange={tableQ.onSearchChange}
            onFilterChange={tableQ.onFilterChange}
            onPageChange={tableQ.setCurrentPage}
            isError={isError}
            errorText={errorMessage || ""}
        />
    )
}
