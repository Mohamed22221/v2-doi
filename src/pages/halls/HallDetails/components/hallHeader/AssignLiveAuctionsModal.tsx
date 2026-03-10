import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { HiSearch } from 'react-icons/hi'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import StatusPill from '@/components/shared/table/StatusPill'
import Icon from '@/components/ui/Icon'
import useWindowSize from '@/components/ui/hooks/useWindowSize'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'
import {
    useGetAssignableAuctions,
    useAssignItemsToHall,
} from '@/api/hooks/halls'
import type { AssignableAuctionItem } from '@/api/types/hall-auctions'
import Spinner from '@/components/ui/Spinner'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import {
    getStatusVariant,
    getStatusLabel,
} from '@/pages/fixed-price/components/GetStatusLabel'
import CategorySelect from '@/components/helpers/CategoriesSelect'
import EffectiveStatusSelect from '@/components/helpers/EffectiveStatusSelect'
import { getApiErrorMessage } from '@/api/error'

import { EffectiveStatus } from '@/api/types/products'

interface AssignLiveAuctionsModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    hallName: string
    onAssign?: (selectedIds: string[]) => void
    hallId: string
}

const AssignLiveAuctionsModal = ({
    isOpen,
    onOpenChange,
    hallName,
    onAssign,
    hallId,
}: AssignLiveAuctionsModalProps) => {
    const { t } = useTranslation()
    const [searchValue, setSearchValue] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [categoryId, setCategoryId] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<EffectiveStatus | null>(
        null,
    )
    const debouncedSearch = useDebouncedValue(searchValue, 400)

    const windowSize = useWindowSize()
    const isMobile = windowSize.width && windowSize.width < 640

    const {
        data,
        isLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useGetAssignableAuctions(
        debouncedSearch,
        categoryId || undefined,
        statusFilter || undefined,
        isOpen,
    )

    const { mutate: assignItems, isPending: isAssigning } =
        useAssignItemsToHall()

    const auctions: AssignableAuctionItem[] = data?.items ?? []

    const toggleSelection = useCallback((id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        )
    }, [])

    const handleAssign = () => {
        assignItems(
            { id: hallId, data: { productIds: selectedIds } },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification
                            title={t('common.success') || 'Success'}
                            type="success"
                        >
                            {t('halls.details.assignModal.successMessage', {
                                count: selectedIds.length,
                            }) ||
                                `${selectedIds.length} auctions have been assigned successfully.`}
                        </Notification>,
                    )
                    onAssign?.(selectedIds)
                    onOpenChange(false)
                    setSelectedIds([])
                },
                onError: (error) => {
                    toast.push(
                        <Notification
                            title={getApiErrorMessage(error)}
                            type="danger"
                        />,
                    )
                },
            },
        )
    }

    const handleCancel = () => {
        onOpenChange(false)
        setSelectedIds([])
    }

    return (
        <Dialog
            isOpen={isOpen}
            width={750}
            height={isMobile ? '100vh' : undefined}
            bodyOpenClassName={'overflow-hidden'}
            contentClassName={
                isMobile ? 'overflow-y-auto pt-4 pb-0 px-2' : 'pt-4 pb-0 px-2'
            }
            closable={true}
            onClose={handleCancel}
            onRequestClose={handleCancel}
        >
            <div className="p-2 sm:p-4">
                <div className="text-center mb-4">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                        {t('halls.details.assignModal.title')}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        {t('halls.details.assignModal.subtitle')}{' '}
                        <span className="text-primary-600 dark:text-primary-200 font-semibold">
                            {hallName}
                        </span>
                    </p>
                </div>

                <div className="mb-4">
                    <Input
                        size="sm"
                        placeholder={t(
                            'halls.details.assignModal.searchPlaceholder',
                        )}
                        prefix={<HiSearch className="text-lg" />}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase whitespace-nowrap">
                            {t('halls.details.assignModal.filters.status')}:
                        </span>
                        <div className="flex-1">
                            <EffectiveStatusSelect
                                placeholder={t(
                                    'halls.details.assignModal.filters.allStatus',
                                )}
                                value={statusFilter}
                                size="sm"
                                onChange={(val) => setStatusFilter(val)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase whitespace-nowrap">
                            {t('halls.details.assignModal.filters.category')}:
                        </span>
                        <div className="flex-1">
                            <CategorySelect
                                value={categoryId}
                                placeholder={t(
                                    'halls.details.assignModal.filters.allCategory',
                                )}
                                size="sm"
                                onChange={(val) =>
                                    setCategoryId(val as string | null)
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="sm:max-h-[43vh]  max-h-[53vh] ] overflow-y-auto custom-scrollbar">
                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex items-center justify-center py-10">
                            <Spinner size={30} />
                        </div>
                    )}

                    {/* Error state */}
                    {isError && !isLoading && (
                        <div className="text-center py-10 text-red-400 text-sm">
                            {t('common.error')}
                        </div>
                    )}

                    {/* Auction Items */}
                    {!isLoading &&
                        !isError &&
                        auctions.map((auction) => (
                            <div
                                key={auction.id}
                                className="flex items-center justify-between px-1  py-2 mb-1 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() => toggleSelection(auction.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={selectedIds.includes(
                                            auction.id,
                                        )}
                                        className="pointer-events-none m-0 p-0"
                                        checkboxClassOuter="h-[17px] w-[17px] sm:h-[32px] sm:w-[32px] rounded-[6px] sm:rounded-[8px]"
                                        onChange={() => {}}
                                    />
                                    <div className="w-[45px] h-[45px] sm:w-[70px] sm:h-[70px] rounded-[10px] sm:rounded-[12px] overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                                        {auction?.images ? (
                                            <img
                                                src={auction.images[0]?.url}
                                                alt={auction.title ?? ''}
                                                className="w-full h-full object-cover"
                                                crossOrigin="anonymous"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Icon name="assets" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="text-[13px] sm:text-[17px] font-bold text-primary-800 dark:text-primary-100">
                                                {auction.title ?? '—'}
                                            </h4>
                                            <StatusPill
                                                variant={getStatusVariant(
                                                    auction.effectiveStatus,
                                                )}
                                                label={getStatusLabel(
                                                    auction.effectiveStatus,
                                                    t,
                                                )}
                                                size="smxs"
                                            />
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400">
                                            <span>
                                                {t(
                                                    'halls.details.assignModal.row.seller',
                                                )}
                                                :
                                            </span>
                                            <div className="flex items-center gap-1 sm:gap-3">
                                                <span>
                                                    {auction?.user
                                                        ? `${auction.user.firstName} ${auction.user.lastName}`
                                                        : '—'}
                                                </span>
                                                {auction?.user?.id && (
                                                    <>
                                                        <span>•</span>
                                                        <span>
                                                            {auction.user.id}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[14px] sm:text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-end gap-1">
                                        {auction.auctionStartingPriceIncVat?.toLocaleString() ??
                                            '—'}
                                        <Icon name="riyal" />
                                    </div>
                                    <p className="text-[10px] sm:text-[12px] text-gray-400 font-semibold leading-none mt-2">
                                        {t(
                                            'halls.details.assignModal.row.startingBid',
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}

                    {/* Empty state */}
                    {!isLoading && !isError && auctions.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            {t('common.noData')}
                        </div>
                    )}

                    {/* Load more */}
                    {hasNextPage && (
                        <div className="flex justify-center py-3">
                            <Button
                                size="sm"
                                variant="plain"
                                loading={isFetchingNextPage}
                                onClick={() => fetchNextPage()}
                            >
                                {t('viewTable.filters.loadMore')}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 flex items-center justify-between">
                <span className="text-gray-500 font-medium">
                    {selectedIds.length}{' '}
                    {t('halls.details.assignModal.footer.selected')}
                </span>
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        className="px-6 sm:px-10 !rounded-xl"
                        onClick={handleCancel}
                    >
                        {t('halls.details.assignModal.footer.cancel')}
                    </Button>
                    <Button
                        variant="solid"
                        color="primary"
                        className="px-6 sm:px-10 !rounded-xl font-bold"
                        disabled={selectedIds.length === 0}
                        loading={isAssigning}
                        onClick={handleAssign}
                    >
                        {t('halls.details.assignModal.footer.assign')}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default AssignLiveAuctionsModal
