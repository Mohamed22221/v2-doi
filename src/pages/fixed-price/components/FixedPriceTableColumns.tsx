import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'

// Components
import TwoLineText from '@/components/shared/table/TwoLineText'
import StatusPill from '@/components/shared/table/StatusPill'
import Button from '@/components/ui/Button'

// Utils & Types
import { formatDateTime } from '@/utils/formatDateTime'
import { Product } from '@/api/types/products'

// Local Components
import { getStatusLabel, getStatusVariant } from './GetStatusLabel'


/**
 * useFixedPriceTableColumns Hook
 * Returns the column definitions for the Fixed Price products table.
 * Includes translations and custom cell rendering for items, sellers, and actions.
 */
export function useFixedPriceTableColumns() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    return useMemo<ColumnDef<Product>[]>(() => {
        return [
            // Item Information Column (Title + Image)
            // Displays the product title and its main image.
            {
                header: t('fixedPrice.table.columns.item'),
                accessorKey: 'title',
                cell: ({ row }) => (
                    <TwoLineText
                        imageSize="sm"
                        image={row.original.images?.[0]?.url}
                        title={row.original.title}
                        subtitle={row.original.id}
                        size="sm"
                    />
                ),
            },
            // Seller Column (Name)
            // Displays the seller's full name (firstName + lastName) or userId as a fallback.
            {
                header: t('fixedPrice.table.columns.seller'),
                accessorKey: 'user',
                cell: ({ row }) => {
                    const user = row.original.user
                    if (user?.firstName || user?.lastName) {
                        return `${user.firstName || ''} ${user.lastName || ''}`.trim()
                    }
                    return row.original.userId
                },
            },
            // Category Column (Name + Image)
            // Displays the category name (translated) and its image.
            {
                header: t('fixedPrice.table.columns.category'),
                accessorKey: 'category',
                cell: ({ row }) => {
                    const categoryName =
                        row.original.category?.translations?.[0]?.name ??
                        row.original.category?.slug ??
                        '-'

                    return (
                        <TwoLineText
                            imageSize="sm"
                            image={row.original.category?.image}
                            title={categoryName}
                            size="sm"
                        />
                    )
                },
            },
            // Status Column (Pill representation)
            // Uses StatusPill to show the effective status of the product.
            {
                header: t('fixedPrice.table.columns.status'),
                accessorKey: 'moderationStatus',
                cell: ({ row }) => (
                    <StatusPill
                        variant={getStatusVariant(row.original.effectiveStatus)}
                        label={getStatusLabel(row.original.effectiveStatus, t)}
                        size="sm"
                    />
                ),
            },
            // Created At Column (Date + Time)
            // Formats and displays the creation date and time.
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
            // Actions Column (View Details Button)
            // Navigation button to the product's details page.
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

