import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useDisputesTableColumns } from './DisputesTableColumns'
import { DisputeItem } from '@/api/types/disputes'
import { useGetDisputeItems } from '../hooks/useGetDisputeItems'
import Button from '@/components/ui/Button'
import { HiDownload } from 'react-icons/hi'

export default function DisputesTable() {
    const { t } = useTranslation()

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('disputes.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('disputes.table.status.resolvedBuyer'),
                        value: 'resolved-buyer',
                    },
                    {
                        label: t('disputes.table.status.resolvedSeller'),
                        value: 'resolved-seller',
                    },
                    {
                        label: t('disputes.table.status.resolvedCompromise'),
                        value: 'resolved-compromise',
                    },
                    {
                        label: t('disputes.table.status.waitingSeller'),
                        value: 'waiting-seller-response',
                    },
                    {
                        label: t('disputes.table.status.disputeOpened'),
                        value: 'dispute-opened',
                    },
                    {
                        label: t('disputes.table.status.platformMediation'),
                        value: 'platform-mediation',
                    },
                ],
                placeholder: t('disputes.table.filters.allStatus'),
            },
            {
                key: 'openedDate',
                label: t('disputes.table.filters.openedDate'),
                type: 'date',
                value: null,
                dateValue: null,
                valueType: 'string',
                options: [],
                placeholder: t('disputes.table.filters.selectDate'),
            },
        ],
        [t],
    )

    const tableQ = useServerTable({
        pageSize: 10,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const {
        items,
        total,
        isLoading,
        isError,
        errorMessage,
        limit
    } = useGetDisputeItems({
        search: tableQ.searchValue,
        status: tableQ.filters.find(f => f.key === 'status')?.value as string,
        openedDate: tableQ.filters.find(f => f.key === 'openedDate')?.dateValue as Date,
        page: tableQ.requestedPage,
        limit: tableQ.pageSize
    })

    const columns = useDisputesTableColumns()

    const handleExport = () => {
        // Placeholder for export functionality
        console.log('Exporting CSV...')
        alert('Exporting CSV... (This is a placeholder)')
    }

    const HeaderActions = () => {
        return (
            <Button
                size="sm md:md"
                icon={<HiDownload className="text-primary-500 dark:text-primary-100" />}
                onClick={handleExport}
            >
                {t('common.exportCsv')}
            </Button>
        )
    }

    return (
        <ViewTable<DisputeItem>
            showSearch
            title={t('disputes.table.title')}
            columns={columns}
            data={items ?? []}
            total={total ?? 0}
            pageSize={limit}
            searchPlaceholder={t('disputes.table.searchPlaceholder')}
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoading}
            emptyText={t('disputes.table.emptyText')}
            avatarInColumns={[]}
            requestedPage={tableQ.requestedPage}
            isError={isError}
            errorText={errorMessage ?? ''}

            onPageChange={tableQ.onPageChange}
            onFilterChange={tableQ.onFilterChange}
            onDateFilterChange={tableQ.onDateFilterChange}
            onSearchChange={tableQ.onSearchChange}
            onClearAll={tableQ.clearAll}
            headerActions={<HeaderActions />}
            showExportButton={false}
        />
    )
}
