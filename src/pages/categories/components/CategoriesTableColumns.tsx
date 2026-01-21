import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { CategoryTableRow } from '@/api/types/categories'
import Icon from '@/components/ui/Icon/Icon'
import StatusSwitcher from './StatusSwitcher'



export function useCategoriesTableColumns({
    onDelete,
}: {
    onDelete: (row: CategoryTableRow) => void
}) {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<CategoryTableRow>[]>(() => {
        const styleItems =
            'inline-flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500 px-3 py-1 text-sm text-primary-500 dark:text-primary-50'
        return [
            {
                header: t('categories.table.columns.categoryName'),
                accessorKey: 'translations',
                cell: ({ row }) => {
                    const enName =
                        row.original.translations.find(
                            (tr) => tr.languageCode === 'en',
                        )?.value ?? row.original.slug

                    const arName =
                        row.original.translations.find(
                            (tr) => tr.languageCode === 'ar',
                        )?.value ?? row.original.slug

                    return (
                        <TwoLineText
                            imageSize="sm"
                            image={row.original.image}
                            title={enName}
                            subtitle={arName}
                            size="sm"
                        />
                    )
                },
            },
            {
                header: t('categories.table.columns.status'),
                accessorKey: 'status',
                cell: ({ row }) => (
                    <StatusPill
                        value={row.original.status === 'active'}
                        activeText={t('common.active')}
                        inactiveText={t('common.inactive')}
                        size="sm"
                    />
                ),
            },
            {
                header: t('categories.table.columns.items'),
                accessorKey: 'itemsCount',
                cell: ({ row }) => (
                    <span className={styleItems}>
                        {row.original.itemsCount?.toLocaleString?.() ?? 0}
                    </span>
                ),
            },
            {
                header: t('categories.table.columns.subCategories'),
                accessorKey: 'children',
                cell: ({ row }) => (
                    <span className={styleItems}>
                        {row.original.children.length ?? 0}
                    </span>
                ),
            },
            {
                header: t(''),
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="plain"
                            onClick={(e) => {
                                e.stopPropagation()
                                navigate(`/categories/${row.original.id}/edit`)
                            }}
                        >
                            <Icon
                                name={'edit'}
                                className="w-[22px] h-[22px] text-primary-400 dark:text-primary-200"
                            />
                        </Button>

                        <Button
                            size="sm"
                            variant="plain"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete(row.original)
                            }}
                        >
                            <Icon
                                name={'delete'}
                                className="w-[22px] h-[22px] text-primary-400 dark:text-primary-200"
                            />
                        </Button>

                        <StatusSwitcher row={row.original} />
                    </div>
                ),
            },
        ]
    }, [navigate, t, onDelete])
}
