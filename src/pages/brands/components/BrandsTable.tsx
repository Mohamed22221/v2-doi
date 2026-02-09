import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { BrandTableRow } from '@/api/types/brands'
import { useGetAllBrands } from '../../../api/hooks/brands'
import { useGetAllCategoriesSelect } from '../../../api/hooks/categories'
import { Button } from '@/components/ui'
import { HiOutlinePlus } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import DeleteBrandModal from './DeleteBrandModal'
import ServerCsvExportButton from '@/components/shared/ServerCsvExportButton'
import BrandsServices from '@/api/services/brands'
import { useBrandsTableColumns } from './BrandsTableColumns'
import { Category } from '@/api/types/categories'
import { useBrandCsvColumns } from './Brands.csv-columns'
import RestoreBrandModal from './RestoreBrandModal'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'


export default function BrandsTable() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isRestoreOpen, setIsRestoreOpen] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState<BrandTableRow | null>(
        null,
    )

    const { brands, isLoading, total, errorMessage, isError, limit } =
        useGetAllBrands()

    const [categorySearch, setCategorySearch] = useState('')
    const debouncedCategorySearch = useDebouncedValue(categorySearch, 400)

    const {
        data: categoriesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
    } = useGetAllCategoriesSelect(debouncedCategorySearch)

    const openDeleteModal = (row: BrandTableRow) => {
        setSelectedBrand(row)
        setIsDeleteOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteOpen(false)
        setSelectedBrand(null)
    }

    const openRestoreModal = (row: BrandTableRow) => {
        setSelectedBrand(row)
        setIsRestoreOpen(true)
    }

    const closeRestoreModal = () => {
        setIsRestoreOpen(false)
        setSelectedBrand(null)
    }

    const columns = useBrandsTableColumns({
        onDelete: openDeleteModal,
        onRestore: openRestoreModal,
    })

    const categoryOptions = useMemo(() => {
        return (
            categoriesData?.items?.map((cat: Category) => {
                const byPageLang = cat.translations?.[0]?.name

                const label = byPageLang || cat.slug

                return {
                    label,
                    value: cat.id,
                }
            }) ?? []
        )
    }, [categoriesData])

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('brands.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('brands.table.status.active'),
                        value: 'active',
                    },
                    {
                        label: t('brands.table.status.inactive'),
                        value: 'inactive',
                    },
                ],
                placeholder: t('brands.table.filters.allStatus'),
                isSearchable: false,
            },
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
                isSearchable: false,
            },
            {
                key: 'categoryId',
                label: t('brands.table.filters.category'),
                value: null,
                valueType: 'string',
                options: categoryOptions,
                placeholder: t('brands.table.filters.allCategories'),
                infinity: {
                    fetchNextPage,
                    hasNextPage,
                    isFetchingNextPage,
                    isFetching,
                },
                isSearchable: true,
                onSearch: (v) => setCategorySearch(v),
            },
        ],
        [
            t,
            categoryOptions,
            fetchNextPage,
            hasNextPage,
            isFetchingNextPage,
            isFetching,
        ],
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
                onClick={() => navigate('/brands/create')}
            >
                {t('brands.addBrand')}
            </Button>
        )
    }

    const csvColumns = useBrandCsvColumns()

    const HeaderActions = () => {
        return (
            <div className="flex items-center gap-2">
                <ServerCsvExportButton
                    fileNamePrefix="brands"
                    columns={csvColumns}
                    currentData={brands}
                    serviceMethod={BrandsServices.getBrands}
                />
                <ButtonCreateLink />
            </div>
        )
    }

    const selectedBrandName = useMemo(() => {
        if (!selectedBrand) return ''
        return (
            selectedBrand.translations[0]?.name ?? selectedBrand.slug
        )
    }, [selectedBrand])

    return (
        <>
            <ViewTable<BrandTableRow>
                showSearch
                title={t('brands.table.title')}
                columns={columns}
                data={brands ?? []}
                total={total ?? 0}
                pageSize={tableQ.pageSize}
                searchPlaceholder={t('brands.table.searchPlaceholder')}
                searchValue={tableQ.searchValue}
                filters={tableQ.filters}
                isLoading={isLoading}
                emptyText={t('brands.table.emptyText')}
                avatarInColumns={[0]}
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

            <DeleteBrandModal
                dialogIsOpen={isDeleteOpen}
                onDialogClose={closeDeleteModal}
                id={selectedBrand?.id ?? ''}
                brandName={selectedBrandName}
                totalItems={selectedBrand?.totalItems}
            />

            <RestoreBrandModal
                dialogIsOpen={isRestoreOpen}
                onDialogClose={closeRestoreModal}
                id={selectedBrand?.id ?? ''}
                brandName={selectedBrandName}
            />
        </>
    )
}
