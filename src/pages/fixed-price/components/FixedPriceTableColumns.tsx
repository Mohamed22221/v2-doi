import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { formatDateTime } from '@/utils/formatDateTime'
import { FixedPriceItem, FixedPriceStatus } from '@/api/types/fixed-price'
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'
import { getStatusLabel, getStatusVariant } from './GetStatusLabel'

export function useFixedPriceTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()


    return useMemo<ColumnDef<FixedPriceItem>[]>(() => {
        return [
            {
                header: t('fixedPrice.table.columns.item'),
                accessorKey: 'name',
                cell: ({ row }) => (
                    <TwoLineText
                        imageSize="sm"
                        image={row.original.image}
                        title={row.original.name}
                        subtitle={row.original.id}
                        size="sm"
                    />
                ),
            },
            {
                header: t('fixedPrice.table.columns.seller'),
                accessorKey: 'seller',
            },
            {
                header: t('fixedPrice.table.columns.category'),
                accessorKey: 'categoryChild',
                cell: ({ row }) => {
                    const enName =
                        row.original.translations.find(
                            (tr) => tr.languageCode.toLowerCase() === 'en',
                        )?.name ?? row.original.slug

                    const arName =
                        row.original.translations.find(
                            (tr) => tr.languageCode.toLowerCase() === 'ar',
                        )?.name ?? row.original.slug

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
                header: t('fixedPrice.table.columns.status'),
                accessorKey: 'status',
                cell: ({ row }) => (
                    <StatusPill
                        variant={getStatusVariant(row.original.status)}
                        label={getStatusLabel(row.original.status)}
                        size="sm"
                    />
                ),
            },
            {
                header: t('fixedPrice.table.columns.createdAt'),
                accessorKey: 'createdAt',
                cell: ({ row }) => {
                    const { date, time } = formatDateTime(
                        row.original.createdAt,
                    )
                    return (
                        <TwoLineText title={date} subtitle={time} size="sm" />
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="w-[120px]">
                        <Button
                            size="md"
                            variant="default"
                            onClick={() =>
                                navigate(`/fixed-price/${row.original.id}`)
                            }
                        >
                            {t('fixedPrice.table.actions.viewDetails')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [navigate, t])
}
