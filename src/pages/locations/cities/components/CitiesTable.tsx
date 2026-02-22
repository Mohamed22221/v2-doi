import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlinePlus } from 'react-icons/hi'

// Components
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import Button from '@/components/ui/Button'
import CityUpsertModal from './CityUpsertModal'
import CityDeleteModal from './CityDeleteModal'

// Hooks
import { useGetAllCities } from '@/api/hooks/cities'
import { useCitiesTableColumns } from './CitiesTableColumns'

// Types
import { City } from '@/api/types/cities'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'

/**
 * CitiesTable Component
 * Renders a data table for cities.
 */
export default function CitiesTable() {
    const { t } = useTranslation()

    // Modal state
    const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedCity, setSelectedCity] = useState<City | null>(null)

    // Fetch cities & regions (for mapping)
    const {
        cities,
        isLoading: isCitiesLoading,
        isError,
        errorMessage,
        limit,
        total,
    } = useGetAllCities()

    const onAdd = () => {
        setSelectedCity(null)
        setIsUpsertModalOpen(true)
    }

    const onEdit = (city: City) => {
        setSelectedCity(city)
        setIsUpsertModalOpen(true)
    }

    const onDelete = (city: City) => {
        setSelectedCity(city)
        setIsDeleteModalOpen(true)
    }

    // Column definitions
    const columns = useCitiesTableColumns(onEdit, onDelete)

    /**
     * HeaderActions Component
     * Renders the "Add City" action in the table header.
     */
    const HeaderActions = () => {
        return (
            <Button
                size="md"
                variant="solid"
                icon={<HiOutlinePlus />}
                onClick={onAdd}
            >
                {t('locations.cities.actions.addCity')}
            </Button>
        )
    }

    const filtersConfig: ServerFilterConfig[] = useMemo(() => [], [t])
    const tableQ = useServerTable({
        pageSize: limit,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    return (
        <>
            <ViewTable<City>
                showSearch
                title={t('locations.cities.table.title')}
                emptyText={t('locations.cities.table.emptyText')}
                columns={columns}
                data={cities ?? []}
                total={total ?? 0}
                pageSize={tableQ.pageSize}
                isLoading={isCitiesLoading}
                requestedPage={tableQ.requestedPage}
                isError={isError}
                errorText={errorMessage ?? ''}
                onPageChange={tableQ.onPageChange}
                onFilterChange={tableQ.onFilterChange}
                onSearchChange={tableQ.onSearchChange}
                onClearAll={tableQ.clearAll}
                searchValue={tableQ.searchValue}
                headerActions={<HeaderActions />}
                showExportButton={false}
            />
            <CityUpsertModal
                isOpen={isUpsertModalOpen}
                onClose={() => setIsUpsertModalOpen(false)}
                city={selectedCity}
            />
            <CityDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                city={selectedCity}
            />
        </>
    )
}
