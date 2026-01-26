import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { ModelTableRow } from '@/api/types/models'
import { Button } from '@/components/ui'
import Icon from '@/components/ui/Icon/Icon'
import { useNavigate } from 'react-router-dom'
import TwoLineText from '@/components/shared/table/TwoLineText'

interface UseModelsTableColumnsProps {
    onDelete: (row: ModelTableRow) => void
}

export const useModelsTableColumns = ({
    onDelete,
}: UseModelsTableColumnsProps) => {
    const { t } = useTranslation()
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
                accessorKey: 'brandId',
            },
            {
                header: t('models.table.columns.category'),
                accessorKey: 'categoryId',
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
                cell: ({ row }) => (
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
                ),
            },
        ],
        [t, onDelete, navigate],
    )
}
