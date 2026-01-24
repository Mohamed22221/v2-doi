import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { Language } from '@/api/types/languages'
import Icon from '@/components/ui/Icon/Icon'

export function useLanguagesTableColumns({
    onDelete,
}: {
    onDelete: (row: Language) => void
}) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    return useMemo<ColumnDef<Language>[]>(() => {
        return [
            {
                header: t('languages.table.columns.code'),
                accessorKey: 'code',
                cell: ({ row }) => {
                    return (
                        <span className="font-bold uppercase">
                            {row.original.code}
                        </span>
                    )
                },
            },
            {
                header: t('languages.table.columns.name'),
                accessorKey: 'name',
            },
            {
                header: t('languages.table.columns.status'),
                accessorKey: 'isActive',
                cell: ({ row }) => (
                    <StatusPill
                        value={row.original.isActive}
                        activeText={t('common.active')}
                        inactiveText={t('common.inactive')}
                        size="sm"
                    />
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
                                navigate(`/languages/${row.original.id}/edit`)
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
        ]
    }, [t, onDelete, navigate])
}
