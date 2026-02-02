import { LiveAuctionItemDetails } from '@/api/types/live-auctions'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import StatusPill from '@/components/shared/table/StatusPill'
import { Button } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import LiveAuctionStatusModal from './LiveAuctionStatusModal'
import { getLiveAuctionStatusLabel, getLiveAuctionStatusVariant } from '../../components/GetStatusLabel'
import { ModalType } from './modalStatus/types'

import AccountId from '@/components/shared/cards/AccountId'

interface Props {
    data?: LiveAuctionItemDetails
}

const LiveAuctionInfo = ({ data }: Props) => {
    const { t } = useTranslation()
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean
        type: ModalType
    }>({
        isOpen: false,
        type: 'reject',
    })

    const openModal = (type: ModalType) => {
        setModalConfig({ isOpen: true, type })
    }

    return (
        <BackgroundRounded>
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-semibold ">
                            {data?.name}
                        </h2>
                        <StatusPill
                            variant={getLiveAuctionStatusVariant(data?.status)}
                            label={getLiveAuctionStatusLabel(data?.status)}
                            size="sm"
                        />
                    </div>
                    <AccountId id={data?.id || ''} />
                </div>

                <div className="flex gap-3">
                    {data?.status === 'scheduled' && (
                        <>
                            <Button
                                variant="default"
                                size="md"
                                color="red"
                                onClick={() => openModal('reject')}
                            >
                                {t('liveAuctions.details.actions.reject')}
                            </Button>
                            <Button
                                variant="solid"
                                size="md"
                                color='primary'
                                onClick={() => openModal('hide')}
                            >
                                {t('liveAuctions.details.actions.hide')}
                            </Button>
                        </>
                    )}

                    {data?.status === 'live' && (
                        <>
                            <Button
                                variant="default"
                                size="md"
                                color="red"
                                onClick={() => openModal('force_end')}
                            >
                                {t('liveAuctions.details.actions.forceEnd')}
                            </Button>
                            <Button
                                variant="solid"
                                size="md"
                                color="primary"
                                onClick={() => openModal('hide')}
                            >
                                {t('liveAuctions.details.actions.hide')}
                            </Button>
                        </>
                    )}

                    {data?.status === 'hidden' && (
                        <Button
                            variant="solid"

                            size="md"
                            onClick={() => openModal('unhide')}
                        >
                            {t('liveAuctions.details.actions.unhide')}
                        </Button>
                    )}
                </div>
            </div>

            <LiveAuctionStatusModal
                isOpen={modalConfig.isOpen}
                type={modalConfig.type}
                id={data?.id || ''}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            />
        </BackgroundRounded>
    )
}

export default LiveAuctionInfo
