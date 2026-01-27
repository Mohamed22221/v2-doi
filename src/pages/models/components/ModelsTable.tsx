import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { ModelTableRow } from '@/api/types/models'
import { useGetAllModels } from '@/api/hooks/models'
import { Button } from '@/components/ui'
import { HiOutlinePlus } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import DeleteModelModal from './DeleteModelModal'
import { useGetAllBrandsSelect } from '@/api/hooks/brands'
import { useGetAllCategoriesSelect } from '@/api/hooks/categories'
import ServerCsvExportButton from '@/components/shared/ServerCsvExportButton'
import ModelsServices from '@/api/services/models'
import { useModelCsvColumns } from './Models.csv-columns'
import { Category } from '@/api/types/categories'
import { useModelsTableColumns } from './ModelsTableColumns'
import { Brand } from '@/api/types/brands'
import RestoreModelModal from './RestoreModelModal'

export default function ModelsTable() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedModel, setSelectedModel] = useState<ModelTableRow | null>(
        null,
    )
    const [isRestoreOpen, setIsRestoreOpen] = useState(false)

    const { models, isLoading, total, errorMessage, isError, limit } =
        useGetAllModels()
    const {
        data: brandsData,
        fetchNextPage: fetchNextPageBrand,
        hasNextPage: hasNextPageBrand,
        isFetchingNextPage: isFetchingNextPageBrand,
        isFetching: isFetchingBrand,
    } = useGetAllBrandsSelect()

    const {
        data: categoriesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
    } = useGetAllCategoriesSelect()

    const openDeleteModal = (row: ModelTableRow) => {
        setSelectedModel(row)
        setIsDeleteOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteOpen(false)
        setSelectedModel(null)
    }

    const openRestoreModal = (row: ModelTableRow) => {
        setSelectedModel(row)
        setIsRestoreOpen(true)
    }

    const closeRestoreModal = () => {
        setIsRestoreOpen(false)
        setSelectedModel(null)
    }

    const columns = useModelsTableColumns({
        onDelete: openDeleteModal,
        onRestore: openRestoreModal,
    })
    const pageLanguage = i18n.language

    const categoryOptions = useMemo(() => {
        return (
            categoriesData?.items?.map((cat: Category) => {
                const byPageLang = cat.translations.find(
                    (tr) => tr.languageCode.toLowerCase() === pageLanguage.toLowerCase(),
                )?.name

                const label = byPageLang || cat.slug

                return {
                    label,
                    value: cat.id,
                }
            }) ?? []
        )
    }, [categoriesData, pageLanguage])

    const brandsOptions = useMemo(() => {
        return (
            brandsData?.items?.map((cat: Brand) => {
                const byPageLang = cat.translations.find(
                    (tr) => tr.languageCode.toLowerCase() === pageLanguage.toLowerCase(),
                )?.name

                const label = byPageLang || cat.slug

                return {
                    label,
                    value: cat.id,
                }
            }) ?? []
        )
    }, [brandsData, pageLanguage])

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'isDeleted',
                label: t('users.table.filters.isDeleted'),
                value: null,
                valueType: 'boolean',
                options: [
                    { label: t('users.table.status.isDeleted'), value: true },
                    { label: t('users.table.status.nonDeleted'), value: false },
                ],
                placeholder: t('users.table.filters.allStatus'),
            },
            {
                key: 'brandId',
                label: t('models.brand'),
                value: null,
                valueType: 'string',
                options: brandsOptions,
                placeholder: t('models.table.filters.allBrands'),
                infinity: {
                    fetchNextPage: fetchNextPageBrand,
                    hasNextPage: hasNextPageBrand,
                    isFetchingNextPage: isFetchingNextPageBrand,
                    isFetching: isFetchingBrand,
                },
            },
            {
                key: 'categoryId',
                label: t('models.category'),
                value: null,
                valueType: 'string',
                options: categoryOptions,
                placeholder: t('models.table.filters.allCategories'),
                infinity: {
                    fetchNextPage,
                    hasNextPage,
                    isFetchingNextPage,
                    isFetching,
                },
            },
            {
                key: 'releaseYear',
                label: t('models.releaseYear'),
                type: 'year',
                value: null,
                valueType: 'number',
                options: [],
                placeholder: t('models.releaseYearPlaceholder'),
            },
        ],
        [
            t,
            brandsOptions,
            categoryOptions,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isFetching,
            fetchNextPageBrand,
            hasNextPageBrand,
            isFetchingNextPageBrand,
            isFetchingBrand,
        ],
    )

    const tableQ = useServerTable({
        pageSize: limit,
        initialFilters: filtersConfig,
        searchParamKey: 'search',
        pageParamKey: 'page',
        limitParamKey: 'limit',
    })

    const csvColumns = useModelCsvColumns()

    const HeaderActions = () => {
        return (
            <div className="flex items-center gap-2">
                <ServerCsvExportButton
                    fileNamePrefix="models"
                    columns={csvColumns}
                    currentData={models}
                    serviceMethod={ModelsServices.getModels}
                />
                <Button
                    size="md"
                    variant="solid"
                    icon={
                        <HiOutlinePlus className="text-primary-50 dark:text-primary-100" />
                    }
                    onClick={() => navigate('/models/create')}
                >
                    {t('models.addModel')}
                </Button>
            </div>
        )
    }

    return (
        <>
            <ViewTable<ModelTableRow>
                showSearch
                title={t('models.table.title')}
                columns={columns}
                data={models ?? []}
                total={total ?? 0}
                pageSize={tableQ.pageSize}
                searchPlaceholder={t('models.table.searchPlaceholder')}
                searchValue={tableQ.searchValue}
                filters={tableQ.filters}
                isLoading={isLoading}
                emptyText={t('models.table.emptyText')}
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

            <DeleteModelModal
                dialogIsOpen={isDeleteOpen}
                onDialogClose={closeDeleteModal}
                id={selectedModel?.id ?? ''}
                modelName={selectedModel?.name ?? ''}
            />

            <RestoreModelModal
                dialogIsOpen={isRestoreOpen}
                onDialogClose={closeRestoreModal}
                id={selectedModel?.id ?? ''}
                modelName={selectedModel?.name ?? ''}
            />
        </>
    )
}
