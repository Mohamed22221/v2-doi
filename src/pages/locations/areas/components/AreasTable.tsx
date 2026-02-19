import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { HiOutlinePlus } from 'react-icons/hi'

// Components
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import Button from '@/components/ui/Button'
import AreaUpsertModal from './AreaUpsertModal'
import AreaDeleteModal from './AreaDeleteModal'

// Hooks
import { useGetAllAreas } from '@/api/hooks/areas'
import { useAreasTableColumns } from './AreasTableColumns'

// Types
import { Area } from '@/api/types/areas'

/**
 * AreasTable Component
 * Renders a data table for areas.
 */
export default function AreasTable() {
    const { t } = useTranslation()

    // Modal state
    const [isUpsertModalOpen, setIsUpsertModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedArea, setSelectedArea] = useState<Area | null>(null)

    // Fetch areas
    const { areas, isLoading, isError, errorMessage } = useGetAllAreas()

    const onAdd = () => {
        setSelectedArea(null)
        setIsUpsertModalOpen(true)
    }

    const onEdit = (area: Area) => {
        setSelectedArea(area)
        setIsUpsertModalOpen(true)
    }

    const onDelete = (area: Area) => {
        setSelectedArea(area)
        setIsDeleteModalOpen(true)
    }

    // Column definitions
    const columns = useAreasTableColumns(onEdit, onDelete)

    /**
     * HeaderActions Component
     * Renders the "Add Area" action in the table header.
     */
    const HeaderActions = () => {
        return (
            <Button
                size="md"
                variant='solid'
                icon={<HiOutlinePlus />}
                onClick={onAdd}
            >
                {t('locations.areas.actions.addArea')}
            </Button>
        )
    }

    return (
        <>
            <ViewTable<Area>
                showSearch={false}
                title={t('locations.areas.table.title')}
                columns={columns}
                data={areas ?? []}
                total={areas?.length ?? 0}
                pageSize={areas?.length || 10}
                isLoading={isLoading}
                emptyText={t('locations.areas.table.emptyText')}
                requestedPage={1}
                isError={isError}
                errorText={errorMessage}
                onPageChange={() => { }}
                onSearchChange={() => { }}
                searchValue=""
                headerActions={<HeaderActions />}
                showExportButton={false}
            />
            <AreaUpsertModal
                isOpen={isUpsertModalOpen}
                onClose={() => setIsUpsertModalOpen(false)}
                area={selectedArea}
            />
            <AreaDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                area={selectedArea}
            />
        </>
    )
}
