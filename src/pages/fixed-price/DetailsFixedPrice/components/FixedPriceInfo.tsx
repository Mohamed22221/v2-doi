import { FixedPriceItemDetails } from '@/api/types/fixed-price'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import StatusPill from '@/components/shared/table/StatusPill'
import { Button } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import FixedPriceStatusModal from './FixedPriceStatusModal'
import { getStatusLabel, getStatusVariant } from '../../components/GetStatusLabel'

interface Props {
    data?: FixedPriceItemDetails
}

const FixedPriceInfo = ({ data }: Props) => {
    const { t } = useTranslation()
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean
        type: 'reject' | 'hide' | 'unhide'
    }>({
        isOpen: false,
        type: 'reject',
    })


    const openModal = (type: 'reject' | 'hide' | 'unhide') => {
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
                            variant={getStatusVariant(data?.status)}
                            label={getStatusLabel(data?.status)}
                            size="sm"
                        />
                    </div>

                    <div className="mt-1 flex items-center gap-1">
                        <p className="text-primary-500 dark:text-primary-200 text-sm">
                            {t('users.userDetails.accountId')}:
                        </p>
                        <span className="font-medium text-black dark:text-white text-sm">
                            {data?.id}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    {data?.status === 'pending_review' && (
                        <>
                            <Button
                                variant="default"
                                size="md"
                                color="red"
                                onClick={() => openModal('reject')}
                            >
                                {t('fixedPrice.details.actions.reject')}
                            </Button>
                            <Button
                                variant="solid"
                                size="md"
                                className="bg-[#2B3467] hover:bg-[#1E254A]"
                            >
                                {t('fixedPrice.details.actions.approve')}
                            </Button>
                        </>
                    )}

                    {data?.status === 'active' && (
                        <Button
                            variant="solid"
                            size="md"
                            color="red"
                            onClick={() => openModal('hide')}
                        >
                            {t('fixedPrice.details.actions.hide')}
                        </Button>
                    )}

                    {data?.status === 'hidden' && (
                        <Button
                            variant="solid"
                            size="md"
                            onClick={() => openModal('unhide')}
                        >
                            {t('fixedPrice.details.actions.unhide')}
                        </Button>
                    )}
                </div>
            </div>

            <FixedPriceStatusModal
                isOpen={modalConfig.isOpen}
                type={modalConfig.type}
                id={data?.id || ''}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
            />
        </BackgroundRounded>
    )
}

export default FixedPriceInfo
