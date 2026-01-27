import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { ModelTableRow } from '@/api/types/models'
import { Button } from '@/components/ui'
import Icon from '@/components/ui/Icon/Icon'
import { useNavigate } from 'react-router-dom'
import TwoLineText from '@/components/shared/table/TwoLineText'
import { HiOutlineRefresh } from 'react-icons/hi'

interface UseModelsTableColumnsProps {
    onDelete: (row: ModelTableRow) => void
    onRestore: (row: ModelTableRow) => void
}

export const useModelsTableColumns = ({
    onDelete,
    onRestore,
}: UseModelsTableColumnsProps) => {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const styleItems =
        'inline-flex items-center justify-center rounded-full bg-primary-50 dark:bg-primary-500 px-3 py-1 text-sm text-primary-500 dark:text-primary-50'
    return useMemo<ColumnDef<ModelTableRow>[]>(
        () => [
            {
                header: t('models.table.columns.modelName'),
                accessorKey: 'name',
                cell: ({ row }) => (
                    <TwoLineText
                        imageSize="sm"
                        title={`${row.original.name}`}
                        subtitle={row.original.id}
                        subtitlePrefix={t('users.table.columns.idPrefix')}
                        size="sm"
                    />
                ),
            },
            {
                header: t('models.table.columns.brand'),
                accessorKey: 'brand',
                cell: ({ row }) => {
                    const brand = row.original.brand
                    const lang = i18n.language.toLowerCase()
                    const translation = brand?.translations?.find(
                        (tr) => tr.languageCode.toLowerCase() === lang,
                    )
                    return translation?.name || brand?.slug || row.original.brandId
                },
            },
            {
                header: t('models.table.columns.category'),
                accessorKey: 'category',
                cell: ({ row }) => {
                    const category = row.original.category
                    const lang = i18n.language.toLowerCase()
                    const translation = category?.translations?.find(
                        (tr) => tr.languageCode.toLowerCase() === lang,
                    )
                    return (
                        translation?.name ||
                        category?.slug ||
                        row.original.categoryId
                    )
                },
            },
            {
                header: t('models.table.columns.releaseYear'),
                accessorKey: 'releaseYear',
                cell: ({ row }) => (
                    <span className={styleItems}>
                        {row.original.releaseYear}
                    </span>
                ),
            },
            {
                header: '',
                id: 'action',
                cell: ({ row }) => {
                    const isDeleted = typeof row.original.deletedAt === 'string' && row.original.deletedAt !== ''

                    if (isDeleted) {
                        return (
                            <div className="flex items-center gap-2">
                                <div className="sm:shrink-0">
                                    <Button
                                        // color="green"
                                        // variant="solid"
                                        icon={<HiOutlineRefresh />}
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onRestore(row.original)
                                        }}
                                        className="w-full sm:w-auto px-3 "
                                    >
                                        {t('models.restoreModal.confirm')}
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
                                    navigate(`/models/${row.original.id}/edit`)
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
                        </div>
                    )
                },
            },
        ],
        [t, i18n, onDelete, onRestore, navigate],
    )
}
