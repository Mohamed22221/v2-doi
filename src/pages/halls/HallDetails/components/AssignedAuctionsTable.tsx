import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import { useAssignedAuctionsTableColumns } from './AssignedAuctionsTableColumns'
import { AssignedAuctionItem } from '@/api/types/halls'
import { ASSIGNED_AUCTIONS_MOCK } from '../../data/hall-details.mock'

export default function AssignedAuctionsTable() {
    const { t } = useTranslation()
    const [searchValue, setSearchValue] = useState('')

    const filteredData = useMemo(() => {
        if (!searchValue) return ASSIGNED_AUCTIONS_MOCK

        const lowerSearch = searchValue.toLowerCase()
        return ASSIGNED_AUCTIONS_MOCK.filter((item: AssignedAuctionItem) =>
            item.itemName.toLowerCase().includes(lowerSearch) ||
            item.sellerName.toLowerCase().includes(lowerSearch)
        )
    }, [searchValue])

    const columns = useAssignedAuctionsTableColumns()

    return (
        <div>
            <ViewTable<AssignedAuctionItem>
                showSearch

                columns={columns}
                data={filteredData}
                total={filteredData.length}
                pageSize={10}
                searchPlaceholder={t('halls.details.table.searchPlaceholder')}
                searchValue={searchValue}
                isLoading={false}
                emptyText={t('common.noData')}
                requestedPage={1}
                isError={false}
                errorText=""
                onSearchChange={(v) => setSearchValue(v)}
                onPageChange={() => { }}
                showExportButton={false}
            />
        </div>
    )
}
