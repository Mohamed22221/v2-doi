import React, { useState } from 'react'
import { Avatar, Button, toast, Notification } from '@/components/ui'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import StatusPill from '@/components/shared/table/StatusPill'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/utils/formatDateTime'
import { getSellerStatusLabel, getSellerStatusVariant } from '@/pages/sellers/components/GetSellerStatusLabel'
import SellerDropdownOptions from './SellerDropdownOptions'
import SellerSuspendModal from './modalStatus/SellerSuspendModal'
import SellerActivateModal from './modalStatus/SellerActivateModal'
import SellerRestore from './SellerRestore'
import { useSuspendSeller, useActivateSeller } from '@/api/hooks/sellers'

import AccountId from '@/components/shared/cards/AccountId'
import UserInfoMeta from '@/components/shared/cards/UserInfoMeta'

import { SellerItem } from '@/api/types/sellers'

type Props = {
    data?: SellerItem
}

const SellerInfo = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date } = formatDateTime(data?.user?.createdAt || '')
    const [dialogIsOpen, setIsOpen] = useState(false)
    const [activateModalOpen, setActivateModalOpen] = useState(false)
    const { mutate: suspendSeller, isPending: isSuspending } = useSuspendSeller()
    const { mutate: activateSeller } = useActivateSeller()

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }


    const userName = `${data?.user?.firstName || ''} ${data?.user?.lastName || ''}`

    return (
        <BackgroundRounded>
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                    <Avatar
                        src={data?.user?.image || undefined}
                        shape="circle"
                        size={100}
                        className="!w-[100px] !h-[100px]"
                    />
                    <div className="text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <h2 className="text-xl sm:text-2xl font-semibold ">
                                {userName}
                            </h2>
                            <StatusPill
                                variant={getSellerStatusVariant(data?.approvalStatus)}
                                label={getSellerStatusLabel(t, data?.approvalStatus)}
                                size="sm"
                            />
                        </div>

                        <AccountId id={data?.user?.id || ''} />

                        <UserInfoMeta
                            joinedDate={date}
                        />
                    </div>
                </div>

                {/* Right Side Actions */}
                {data?.user?.deletedAt === null && (
                    <div className="flex w-full items-center flex-row justify-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
                        {data?.accountStatus === 'active' && (
                            <Button
                                color={'red'}
                                onClick={() => openDialog()}
                                variant="solid"
                            >
                                {t('users.userDetails.actions.suspendUser')}
                            </Button>
                        )}
                        {data?.accountStatus === 'suspended' && (
                            <Button
                                color={'green'}
                                onClick={() => setActivateModalOpen(true)}
                                variant="solid"
                            >
                                {t('users.userDetails.actions.activateUser')}
                            </Button>
                        )}
                        <SellerDropdownOptions
                            id={data?.user?.id || ''}
                            firstName={data?.user?.firstName || ''}
                            lastName={data?.user?.lastName || ''}
                            approvalStatus={data?.approvalStatus}
                            accountStatus={data?.accountStatus}
                        />
                    </div>
                )}

                <SellerSuspendModal
                    isOpen={dialogIsOpen}
                    id={data?.user?.id || ''}
                    onClose={onDialogClose}
                    onConfirmSuccess={() => {
                        // Success toast is handled within the modal
                    }}
                />
                <SellerActivateModal
                    isOpen={activateModalOpen}
                    id={data?.user?.id || ''}
                    onClose={() => setActivateModalOpen(false)}
                    firstName={data?.user?.firstName}
                    lastName={data?.user?.lastName}
                />
            </div>
            {data?.user?.deletedAt != null && (
                <SellerRestore
                    firstName={data?.user?.firstName}
                    lastName={data?.user?.lastName}
                    id={data?.user?.id || ''}
                />
            )}
        </BackgroundRounded>
    )
}

export default SellerInfo
