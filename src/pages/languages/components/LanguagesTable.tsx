import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { HiOutlinePlus } from 'react-icons/hi'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import { ServerFilterConfig, useServerTable } from '@/utils/hooks/useServerTable'
import { Language } from '@/api/types/languages'
import { useGetAllLanguages } from '@/api/hooks/languages'
import { useLanguagesTableColumns } from './LanguagesTableColumns'
import DeleteLanguageModal from './DeleteLanguageModal'
import { Button } from '@/components/ui'

export default function LanguagesTable() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedLanguage, setSelectedLanguage] =
        useState<Language | null>(null)

    const { languages, isLoading, total, errorMessage, isError, limit } =
        useGetAllLanguages()

    const openDeleteModal = (row: Language) => {
        setSelectedLanguage(row)
        setIsDeleteOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteOpen(false)
        setSelectedLanguage(null)
    }

    const columns = useLanguagesTableColumns({ onDelete: openDeleteModal })

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'isActive',
                label: t('languages.table.columns.status'),
                value: null,
                valueType: 'boolean',
                options: [
                    {
                        label: t('common.active'),
                        value: true,
                    },
                    {
                        label: t('common.inactive'),
                        value: false,
                    },
                ],
                placeholder: t('viewTable.filters.all'),
            },
        ],
        [t],
    )

    const tableQ = useServerTable({
        pageSize: limit,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const ButtonCreateLink = () => {
        return (
            <Button
                size="sm md:md"
                variant="solid"
                icon={
                    <HiOutlinePlus className="text-primary-50 dark:text-primary-100" />
                }
                onClick={() => navigate('/languages/create')}
            >
                {t('common.add')}
            </Button>
        )
    }

    const HeaderActions = () => {
        return (
            <div className="flex items-center gap-2">
                <ButtonCreateLink />
            </div>
        )
    }

    return (
        <>
            <ViewTable<Language>
                showSearch
                title={t('languages.table.title')}
                columns={columns}
                data={languages ?? []}
                total={total ?? 0}
                pageSize={tableQ.pageSize}
                searchPlaceholder={t('languages.table.searchPlaceholder')}
                searchValue={tableQ.searchValue}
                filters={tableQ.filters}
                isLoading={isLoading}
                emptyText={t('languages.table.emptyText')}
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

            <DeleteLanguageModal
                dialogIsOpen={isDeleteOpen}
                onDialogClose={closeDeleteModal}
                id={selectedLanguage?.id ?? ''}
                name={selectedLanguage?.name}
            />
        </>
    )
}
