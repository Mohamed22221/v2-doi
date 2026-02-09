import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { HiSearch } from 'react-icons/hi'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import StatusPill from '@/components/shared/table/StatusPill'
import { ASSIGNABLE_LIVE_AUCTIONS_MOCK } from '../../data/assign-live-auctions.mock'
import { getLiveAuctionStatusLabel, getLiveAuctionStatusVariant } from '../../../live-auctions/components/GetStatusLabel'
import Icon from '@/components/ui/Icon'
import { LiveAuctionStatus } from '@/api/types/live-auctions'
import useWindowSize from '@/components/ui/hooks/useWindowSize'

interface AssignLiveAuctionsModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    hallName: string
    onAssign: (selectedIds: string[]) => void
}

const AssignLiveAuctionsModal = ({
    isOpen,
    onOpenChange,
    hallName,
    onAssign,
}: AssignLiveAuctionsModalProps) => {
    const { t } = useTranslation()
    const [searchValue, setSearchValue] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Filters (UI only for now as per request)
    const [statusFilter, setStatusFilter] = useState<{ label: string; value: string } | null>(null)
    const [categoryFilter, setCategoryFilter] = useState<{ label: string; value: string } | null>(null)
    const [dateFilter, setDateFilter] = useState<{ label: string; value: string } | null>(null)

    const windowSize = useWindowSize()
    const isMobile = windowSize.width && windowSize.width < 640

    const filteredAuctions = useMemo(() => {
        return ASSIGNABLE_LIVE_AUCTIONS_MOCK.filter((auction) => {
            const matchesSearch =
                auction.title.toLowerCase().includes(searchValue.toLowerCase()) ||
                auction.auctionCode.toLowerCase().includes(searchValue.toLowerCase()) ||
                auction.sellerName.toLowerCase().includes(searchValue.toLowerCase())

            return matchesSearch
        })
    }, [searchValue])

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        )
    }

    const handleAssign = () => {
        onAssign(selectedIds)
        onOpenChange(false)
        setSelectedIds([]) // Reset for next time
    }

    const handleCancel = () => {
        onOpenChange(false)
        setSelectedIds([]) // Reset for next time
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleCancel}
            onRequestClose={handleCancel}
            width={750}
            height={isMobile ? '100vh' : undefined}
            bodyOpenClassName={"overflow-hidden"}
            contentClassName={isMobile ? 'overflow-y-auto pt-4 pb-0 px-2' : "pt-4 pb-0 px-2"}

            closable={true}
        >
            <div className="p-2 sm:p-4">
                <div className="text-center mb-4">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                        {t('halls.details.assignModal.title')}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        {t('halls.details.assignModal.subtitle')} <span className="text-primary-600 dark:text-primary-200 font-semibold">{hallName}</span>
                    </p>
                </div>

                <div className="mb-4">
                    <Input
                        size="sm"
                        placeholder={t('halls.details.assignModal.searchPlaceholder')}
                        prefix={<HiSearch className="text-lg" />}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase whitespace-nowrap">
                            {t('halls.details.assignModal.filters.status')}:
                        </span>
                        <div className="flex-1">
                            <Select
                                size="sm"
                                placeholder={t('halls.details.assignModal.filters.allStatus')}
                                options={[]}
                                value={statusFilter}
                                onChange={(opt) => setStatusFilter(opt)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase whitespace-nowrap">
                            {t('halls.details.assignModal.filters.category')}:
                        </span>
                        <div className="flex-1">
                            <Select
                                size="sm"
                                placeholder={t('halls.details.assignModal.filters.allCategory')}
                                options={[]}
                                value={categoryFilter}
                                onChange={(opt) => setCategoryFilter(opt)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-500 uppercase whitespace-nowrap">
                            {t('halls.details.assignModal.filters.date')}:
                        </span>
                        <div className="flex-1">
                            <Select
                                size="sm"
                                placeholder={t('halls.details.assignModal.filters.anytime')}
                                options={[]}
                                value={dateFilter}
                                onChange={(opt) => setDateFilter(opt)}
                            />
                        </div>
                    </div>
                </div>

                <div className="sm:max-h-[320px] max-h-[300px] overflow-y-auto  custom-scrollbar">
                    {filteredAuctions.map((auction) => (
                        <div
                            key={auction.id}
                            className="flex items-center justify-between px-1 py-2 mb-1 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                            onClick={() => toggleSelection(auction.id)}
                        >
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={selectedIds.includes(auction.id)}
                                    className="pointer-events-none m-0 p-0"
                                    onChange={() => { }}
                                    checkboxClassOuter="h-[17px] w-[17px] sm:h-[32px] sm:w-[32px] rounded-[6px] sm:rounded-[8px]"

                                />
                                <div className="w-[45px] h-[45px] sm:w-[70px] sm:h-[70px] rounded-[10px] sm:rounded-[12px] overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                                    <img
                                        src={auction.imageUrl}
                                        alt={auction.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="text-[13px] sm:text-[17px] font-bold text-primary-800 dark:text-primary-100">
                                            {auction.title}
                                        </h4>
                                        <StatusPill
                                            variant={getLiveAuctionStatusVariant(auction.status.toLowerCase() as LiveAuctionStatus)}
                                            label={getLiveAuctionStatusLabel(auction.status.toLowerCase() as LiveAuctionStatus)}
                                            size="smxs"
                                        />
                                    </div>
                                    <p className="flex items-center gap-1 text-[11px] sm:text-[13px] text-gray-500 dark:text-gray-400">
                                        <span>{t('halls.details.assignModal.row.seller')}:</span>
                                        <div className="flex items-center gap-1 sm:gap-3">
                                            <span>{auction.sellerName}</span>
                                            <span>•</span>
                                            <span>{auction.auctionCode}</span>

                                        </div>
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-[14px] sm:text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center justify-end gap-1">
                                    {auction.startingBid.toLocaleString()}
                                    <Icon name="riyal" />
                                </div>
                                <p className="text-[10px] sm:text-[12px] text-gray-400  font-semibold leading-none mt-2">
                                    {t('halls.details.assignModal.row.startingBid')}
                                </p>
                            </div>
                        </div>
                    ))}
                    {filteredAuctions.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            {t('common.noData')}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3  flex items-center justify-between">
                <span className="text-gray-500 font-medium">
                    {selectedIds.length} {t('halls.details.assignModal.footer.selected')}
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
                        onClick={handleAssign}
                        disabled={selectedIds.length === 0}
                    >
                        {t('halls.details.assignModal.footer.assign')}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default AssignLiveAuctionsModal
