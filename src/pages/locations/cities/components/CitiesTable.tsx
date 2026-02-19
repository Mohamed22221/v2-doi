import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlinePlus } from 'react-icons/hi'

// Components
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import Button from '@/components/ui/Button'
import CityUpsertModal from './CityUpsertModal'
import CityDeleteModal from './CityDeleteModal'

// Hooks
import { useGetAllCities } from '@/api/hooks/cities'
import { useGetAllRegions } from '@/api/hooks/regions'
import { useCitiesTableColumns } from './CitiesTableColumns'

// Types
import { City } from '@/api/types/cities'

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
    const { cities, isLoading: isCitiesLoading, isError, errorMessage } = useGetAllCities()
    const { regions, isLoading: isRegionsLoading } = useGetAllRegions()

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
    const columns = useCitiesTableColumns(regions, onEdit, onDelete)

    /**
     * HeaderActions Component
     * Renders the "Add City" action in the table header.
     */
    const HeaderActions = () => {
        return (
            <Button
                size="md"
                variant='solid'
                icon={<HiOutlinePlus />}
                onClick={onAdd}
            >
                {t('locations.cities.actions.addCity')}
            </Button>
        )
    }

    return (
        <>
            <ViewTable<City>
                showSearch={false}
                title={t('locations.cities.table.title')}
                columns={columns}
                data={cities ?? []}
                total={cities?.length ?? 0}
                pageSize={cities?.length || 10}
                isLoading={isCitiesLoading || isRegionsLoading}
                emptyText={t('locations.cities.table.emptyText')}
                requestedPage={1}
                isError={isError}
                errorText={errorMessage}
                onPageChange={() => { }}
                onSearchChange={() => { }}
                searchValue=""
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
