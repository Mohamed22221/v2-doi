import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import {
    ServerFilterConfig,
    useServerTable,
} from '@/utils/hooks/useServerTable'
import { useCategoriesTableColumns } from './CategoriesTableColumns'
import { CategoryTableRow } from '@/api/types/categories'
import { useGetAllCategories } from '../../../api/hooks/categories'
import { Button } from '@/components/ui'
import { HiOutlinePlus } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import DeleteCategoryModal from './DeleteCategoryModal'

export default function CategoriesTable() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryTableRow | null>(null)

    const { categories, isLoading, total, errorMessage, isError, limit } =
        useGetAllCategories()

    const openDeleteModal = (row: CategoryTableRow) => {
        setSelectedCategory(row)
        setIsDeleteOpen(true)
    }

    const closeDeleteModal = () => {
        setIsDeleteOpen(false)
        setSelectedCategory(null)
    }

    const columns = useCategoriesTableColumns({ onDelete: openDeleteModal })

    const filtersConfig: ServerFilterConfig[] = useMemo(
        () => [
            {
                key: 'status',
                label: t('categories.table.filters.status'),
                value: null,
                valueType: 'string',
                options: [
                    {
                        label: t('categories.table.status.active'),
                        value: 'active',
                    },
                    {
                        label: t('categories.table.status.inactive'),
                        value: 'inactive',
                    },
                ],
                placeholder: t('categories.table.filters.allStatus'),
            },
            {
                key: 'level',
                label: t('المستوي'),
                value: null,
                valueType: 'number',
                options: [
                    {
                        label: 'التصنيف الرئيسي',
                        value: 1,
                    },
                    {
                        label: 'التصنيف الفرعي الاول',
                        value: 2,
                    },
                    {
                        label: 'التصنيف الفرعي الثاني',
                        value: 3,
                    },
                ],
                placeholder: t('level'),
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
                size="md"
                variant="solid"
                icon={
                    <HiOutlinePlus className="text-primary-50 dark:text-primary-100" />
                }
                onClick={() => navigate('/categories/create')}
            >
                {t('categories.addCategory')}
            </Button>
        )
    }

    const selectedCategoryName = useMemo(() => {
        if (!selectedCategory) return ''
        return (
            selectedCategory.translations.find((tr) => tr.languageCode === 'en')
                ?.name ?? selectedCategory.slug
        )
    }, [selectedCategory])

    return (
        <>
            <ViewTable<CategoryTableRow>
                showSearch
                title={t('categories.table.title')}
                columns={columns}
                data={categories ?? []}
                total={total ?? 0}
                pageSize={tableQ.pageSize}
                searchPlaceholder={t('categories.table.searchPlaceholder')}
                searchValue={tableQ.searchValue}
                filters={tableQ.filters}
                isLoading={isLoading}
                emptyText={t('categories.table.emptyText')}
                avatarInColumns={[0]}
                requestedPage={tableQ.requestedPage}
                isError={isError}
                errorText={errorMessage ?? ''}
                onPageChange={tableQ.onPageChange}
                onFilterChange={tableQ.onFilterChange}
                onSearchChange={tableQ.onSearchChange}
                onClearAll={tableQ.clearAll}
                headerActions={<ButtonCreateLink />}
            />

            <DeleteCategoryModal
                dialogIsOpen={isDeleteOpen}
                onDialogClose={closeDeleteModal}
                id={selectedCategory?.id ?? ''}
                categoryName={selectedCategoryName}
                itemsCount={selectedCategory?.itemsCount ?? 0}
                subCategoriesCount={selectedCategory?.children.length ?? 0}
                status={selectedCategory?.status ?? "active"}
            />
        </>
    )
}
