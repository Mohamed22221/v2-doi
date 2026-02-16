import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Components
import { Button, Dialog, Icon } from '@/components/ui'
import ViewTable from '@/components/ui/Table/ViewTable/ViewTable'
import TwoLineText from '@/components/shared/table/TwoLineText'
import SectionHeader from '@/components/shared/cards/SectionHeader'
import InfoRow from '@/components/shared/cards/InfoRow'
import { CategoryBreadcrumb } from '@/components/helpers/CategoryBreadcrumb'

// Hooks
import useWindowSize from '@/components/ui/hooks/useWindowSize'

// Types
import { ColumnDef } from '@tanstack/react-table'
import { Product } from '@/api/types/products'

interface BundleItemsTableCardProps {
    /** Whether the product is a bundle */
    isBundle: boolean
    /** Array of bundle items */
    bundleItems?: Product[]
    /** Optional currency symbol (default "riyals") */
    currencySymbol?: React.ReactNode
    /** Optional price formatter */
    formatPrice?: (price: Product['price']) => string
    /** Optional custom view handler */
    onViewItem?: (item: Product) => void
}


/**
 * BundleItemsTableCard component
 * Renders a table of items that are part of a bundle.
 * Includes a detailed modal for viewing individual item information.
 */
export default function BundleItemsTableCard({
    isBundle,
    bundleItems = [],
    currencySymbol = <Icon name="riyal" />,
    formatPrice,
    onViewItem,
}: BundleItemsTableCardProps) {
    const { t, i18n } = useTranslation()
    const [selectedItem, setSelectedItem] = useState<Product | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Render logic: Only show if it's a bundle with items
    if (!isBundle || !bundleItems || bundleItems.length === 0) {
        return null
    }

    const handleViewItem = (item: Product) => {
        if (onViewItem) {
            onViewItem(item)
        } else {
            setSelectedItem(item)
            setIsModalOpen(true)
        }
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedItem(null)
    }

    const defaultFormatPrice = (price: Product['price']) => {
        if (price === null || price === undefined) return '—'
        const numPrice = typeof price === 'string' ? parseFloat(price) : price
        if (isNaN(numPrice)) return '—'
        return `${numPrice.toLocaleString()}`
    }

    const priceFormatter = formatPrice || defaultFormatPrice

    const windowSize = useWindowSize()
    const isMobile = windowSize.width && windowSize.width < 640

    // Define columns using useMemo
    const columns = useMemo<ColumnDef<Product>[]>(() => {
        return [
            {
                header: t('common.item'),
                accessorKey: 'title',
                cell: ({ row }) => (
                    <TwoLineText
                        image={row.original.images?.[0]?.url || '/placeholder-product.png'}
                        imageAlt={row.original.title}
                        imageSize="lg"
                        title={row.original.title}
                        subtitle={`ID: ${row.original.id}`}
                        size="sm"
                    />
                ),
            },
            {
                header: t('common.category'),
                accessorKey: 'category',
                cell: ({ row }) => (
                    <CategoryBreadcrumb category={row.original.category} orientation="vertical" size="sm" />

                ),
            },
            {
                header: t('common.price'),
                accessorKey: 'price',
                cell: ({ row }) => (
                    <span className="text-sm flex items-center gap-1 font-medium text-gray-900 dark:text-gray-100">
                        {priceFormatter(row.original.price)}
                        {currencySymbol}
                    </span>
                ),
            },
            {
                header: '',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="w-[80px]">
                        <Button
                            variant="default"
                            className="rounded-xl"
                            onClick={() => handleViewItem(row.original)}
                        >
                            {t('common.view')}
                        </Button>
                    </div>
                ),
            },
        ]
    }, [t, i18n.language])

    return (
        <>
            <div>
                <span className="text-lg font-semibold text-gray-400 dark:text-gray-100 px-3 mt-3">
                    {t('common.products')} ({bundleItems.length})
                </span>
                <div className="[&>div>div:last-child]:hidden">
                    <ViewTable<Product>
                        showSearch={false}
                        columns={columns}
                        data={bundleItems}
                        total={bundleItems.length}
                        pageSize={bundleItems.length}
                        searchPlaceholder=""
                        searchValue=""
                        isLoading={false}
                        emptyText={t('common.noData')}
                        requestedPage={1}
                        isError={false}
                        errorText=""
                        onSearchChange={() => { }}
                        onPageChange={() => { }}
                        showExportButton={false}
                        avatarInColumns={[0]}
                    // title={`${t('common.products')} (${bundleItems.length})`}
                    />
                </div>
            </div>

            {/* Product Details Modal */}
            {selectedItem && (
                <Dialog
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onRequestClose={handleCloseModal}
                    width={750}
                    height={isMobile ? '100vh' : undefined}

                    closable
                >
                    <div className="p-3 space-y-2">
                        <h3 className="text-center text-xl font-bold py-1">
                            {t('common.productDetails')}
                        </h3>
                        {/* Modal Header with Product Image and Title */}
                        <div className="flex items-center gap-4 pb-2">
                            <img
                                src={selectedItem.images?.[0]?.url || '/placeholder-product.png'}
                                alt={selectedItem.title}
                                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                crossOrigin="anonymous"
                            />
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {selectedItem.title}
                                </h2>
                                <div className="mt-1 flex items-center gap-1">
                                    <p className="text-primary-500 dark:text-primary-200 text-sm">
                                        {t('users.userDetails.accountId')}:
                                    </p>
                                    <Link to={`/fixed-price/${selectedItem.id}`} className="font-medium text-black dark:text-white text-sm">
                                        {selectedItem.id}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information Section */}
                        <div>
                            <SectionHeader title={t('common.basicInformation')} className='!mb-2 !mt-3' />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                <InfoRow
                                    label={t('common.category')}
                                    value={
                                        <CategoryBreadcrumb
                                            category={selectedItem.category}
                                            size="sm"
                                        />
                                    }
                                />
                                <InfoRow
                                    label={t('common.productCondition')}
                                    value={selectedItem.status}
                                />
                                <div className=''>
                                    <div className='mt-1'>
                                        <InfoRow
                                            label={t('common.description')}
                                            value={selectedItem.description}
                                        />
                                    </div>
                                    <div className='mt-1'>
                                        <InfoRow
                                            label={t('common.productDefects')}
                                            value={selectedItem.defects}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Pricing & Stock Section */}
                        <div>
                            <SectionHeader title={t('common.pricingAndStock')} className='!mb-2 !mt-3' />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                                <InfoRow
                                    label={t('common.availableQuantity')}
                                    value={selectedItem.quantity}
                                />
                                <InfoRow
                                    label={t('common.price')}
                                    value={
                                        <span className="flex items-center gap-1">
                                            {priceFormatter(selectedItem.price)}
                                            {currencySymbol}
                                        </span>
                                    }
                                />
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="flex justify-center pt-4">
                            <Button
                                variant="default"
                                onClick={handleCloseModal}
                                className="min-w-[120px] w-full"
                            >
                                {t('common.close')}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    )
}
