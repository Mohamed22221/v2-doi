import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { BrandTableRow } from '@/api/types/brands'
import Icon from '@/components/ui/Icon/Icon'
import StatusSwitcher from './StatusSwitcher'
import { HiOutlineRefresh } from 'react-icons/hi'

export function useBrandsTableColumns({
    onDelete,
    onRestore,
}: {
    onDelete: (row: BrandTableRow) => void
    onRestore: (row: BrandTableRow) => void
}) {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<BrandTableRow>[]>(() => {
        const styleItems =
            'inline-flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500 px-3 py-1 text-sm text-primary-500 dark:text-primary-50'
        return [
            {
                header: t('brands.table.columns.brandName'),
                accessorKey: 'translations',
                cell: ({ row }) => {
                    const name =
                        row.original.translations?.[0]?.name ?? row.original.slug
                    return (
                        <TwoLineText
                            imageSize="sm"
                            image={row.original.logoUrl}
                            title={name}
                            size="sm"
                        />
                    )
                },

            },
            {
                header: t('brands.table.columns.status'),
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
                header: t('brands.table.columns.items'),
                accessorKey: 'totalItems',
                cell: ({ row }) => (
                    <span className={styleItems}>
                        {row.original.totalItems?.toLocaleString?.() ?? 0}
                    </span>
                ),
            },
            {
                header: t(''),
                id: 'actions',
                cell: ({ row }) => {
                    const isDeleted = typeof row.original.deletedAt === 'string' && row.original.deletedAt !== ''

                    if (isDeleted) {
                        return (
                            <div className="flex items-center gap-2">
                                <div className="sm:shrink-0">
                                    <Button
                                        icon={<HiOutlineRefresh />}
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onRestore(row.original)
                                        }}
                                        className="w-full sm:w-auto px-3 "
                                    >
                                        {t('brands.restoreModal.confirm')}
                                    </Button>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="plain"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/brands/${row.original.id}/edit`)
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
                    )
                },
            },
        ]
    }, [navigate, t, onDelete, onRestore])
}
