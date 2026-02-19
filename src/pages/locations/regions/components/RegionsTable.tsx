import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlinePlus } from 'react-icons/hi'

// Components
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import Button from '@/components/ui/Button'
import RegionUpsertModal from './RegionUpsertModal'
import RegionDeleteModal from './RegionDeleteModal'

// Hooks
import { useGetAllRegions } from '@/api/hooks/regions'
import { useRegionsTableColumns } from './RegionsTableColumns'

// Types
import { Region } from '@/api/types/regions'

/**
 * RegionsTable Component
 * Renders a data table for regions.
 * Search and Pagination are disabled as per user request.
 */
export default function RegionsTable() {
    const { t } = useTranslation()

    // Modal state
    const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null)

    // Fetch regions
    const { regions, isLoading, isError, errorMessage } = useGetAllRegions()

    const onAdd = () => {
        setSelectedRegion(null)
        setIsUpsertModalOpen(true)
    }

    const onEdit = (region: Region) => {
        setSelectedRegion(region)
        setIsUpsertModalOpen(true)
    }

    const onDelete = (region: Region) => {
        setSelectedRegion(region)
        setIsDeleteModalOpen(true)
    }

    // Column definitions
    const columns = useRegionsTableColumns(onEdit, onDelete)

    /**
     * HeaderActions Component
     * Renders the "Add Region" action in the table header.
     */
    const HeaderActions = () => {
        return (
            <Button
                size="md"
                variant='solid'
                icon={<HiOutlinePlus />}
                onClick={onAdd}
            >
                {t('locations.regions.actions.addRegion')}
            </Button>
        )
    }

    return (
        <>
            <ViewTable<Region>
                showSearch={false}
                title={t('locations.regions.table.title')}
                columns={columns}
                data={regions ?? []}
                total={regions?.length ?? 0}
                pageSize={regions?.length || 10}
                isLoading={isLoading}
                emptyText={t('locations.regions.table.emptyText')}
                requestedPage={1}
                isError={isError}
                errorText={errorMessage}
                onPageChange={() => { }}
                onSearchChange={() => { }}
                searchValue=""
                headerActions={<HeaderActions />}
                showExportButton={false}
            />
            <RegionUpsertModal
                isOpen={isUpsertModalOpen}
                onClose={() => setIsUpsertModalOpen(false)}
                region={selectedRegion}
            />
            <RegionDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                region={selectedRegion}
            />
        </>
    )
}
