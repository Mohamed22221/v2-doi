import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useHallsTableColumns } from './HallsTableColumns'
import { HallItem } from '@/api/types/halls'
import { useGetHalls } from '../hooks/useGetHalls'
import Button from '@/components/ui/Button'
import { HiDownload, HiPlus } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'

export default function HallsTable() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('halls.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('halls.table.status.active'),
                        value: 'active',
                    },
                    {
                        label: t('halls.table.status.achieved'),
                        value: 'achieved',
                    },
                    {
                        label: t('halls.table.status.hidden'),
                        value: 'hidden',
                    },
                ],
                placeholder: t('halls.table.filters.allStatus'),
            },
            {
                key: 'dateRange',
                label: t('halls.table.filters.dateRange'),
                value: null,
                type: 'date',
                options: [],
                placeholder: t('halls.table.filters.today'),
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
    } = useGetHalls({
        search: tableQ.searchValue,
        status: tableQ.filters.find(f => f.key === 'status')?.value as string,
        page: tableQ.requestedPage,
        limit: tableQ.pageSize
    })

    const columns = useHallsTableColumns()

    const handleExport = () => {
        console.log('Exporting CSV...')
        alert('Exporting CSV... (This is a placeholder)')
    }

    const handleCreate = () => {
        navigate('/halls/create')
    }

    const HeaderActions = () => {
        return (
            <div className="flex items-center gap-2">
                <Button
                    size="md"
                    icon={<HiDownload />}
                    onClick={handleExport}
                >
                    {t('common.exportCsv')}
                </Button>
                <Button
                    size="md"
                    variant="solid"
                    icon={<HiPlus />}
                    onClick={handleCreate}
                >
                    {t('halls.table.actions.createHall')}
                </Button>
            </div>
        )
    }

    return (
        <ViewTable<HallItem>
            showSearch
            title={t('halls.table.title')}
            columns={columns}
            data={items ?? []}
            total={total ?? 0}
            pageSize={limit}
            searchPlaceholder={t('halls.table.searchPlaceholder')}
            searchValue={tableQ.searchValue}
            filters={tableQ.filters}
            isLoading={isLoading}
            emptyText={t('halls.table.emptyText')}
            requestedPage={tableQ.requestedPage}
            isError={isError}
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
