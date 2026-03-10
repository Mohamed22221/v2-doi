import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/ui'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import { HallAuctionItem } from '@/api/types/hall-auctions'

type AuctionSequenceProps = {
    items: HallAuctionItem[]
}

const AuctionSequence = ({ items }: AuctionSequenceProps) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col gap-2">
            <HeaderInformation
                title={t('halls.details.header.sequenceTitle')}
                icon={<Icon name="sequence" />}
                subTilte={t('halls.details.header.sequenceSubtitle')}
            />
            {/* <p className="-mt-6 text-sm text-slate-400 dark:text-gray-400">
                {t('halls.details.header.sequenceSubtitle')}
            </p> */}

            <div className="space-y-6 mt-1">
                {items.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        {t('common.noData')}
                    </p>
                ) : (
                    items.map((item, index) => {
                        const seller =
                            item.product?.user?.seller?.businessName ||
                            `${item.product?.user?.firstName || ''} ${item.product?.user?.lastName || ''}`.trim() ||
                            '—'

                        return (
                            <div
                                key={item.id}
                                className="flex items-center gap-4"
                            >
                                <div
                                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0 ${
                                        index === 0
                                            ? 'bg-primary-400 dark:bg-primary-900 text-white'
                                            : 'bg-primary-50 text-primary-300 dark:bg-primary-900/20 dark:text-primary-600'
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-[#1E293B] dark:text-gray-100 truncate">
                                        {item.product?.title || item.id}
                                    </span>
                                    <span className="text-sm text-slate-400 dark:text-gray-400 truncate">
                                        {seller}
                                    </span>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default AuctionSequence
