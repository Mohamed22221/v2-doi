import React, { useState } from 'react'
import { Avatar, Button, toast, Notification } from '@/components/ui'
import Icon from '@/components/ui/Icon/Icon'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import StatusPill from '@/components/shared/table/StatusPill'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/utils/formatDateTime'
import { getSellerStatusLabel, getSellerStatusVariant } from '@/pages/sellers/components/GetSellerStatusLabel'
import SellerDropdownOptions, { SellerAction } from './SellerDropdownOptions'
import SuspendUserModal from '@/pages/users/DetailsUser/components/SuspendUserModal'
import { useToggleUserStatus } from '@/api/hooks/users'
import { getApiErrorMessage } from '@/api/error'

import AccountId from '@/components/shared/cards/AccountId'
import UserInfoMeta from '@/components/shared/cards/UserInfoMeta'

type Props = {
    data?: any // SellerItem
}

const SellerInfo = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date } = formatDateTime(data?.createdAt || '')
    const [suspendModalOpen, setSuspendModalOpen] = useState(false)
    const { mutate, isPending } = useToggleUserStatus()

    const handleSellerAction = (action: SellerAction) => {
        console.log('Seller action:', action)
        // Implementation for approve/reject would go here
    }

    const onSuspendConfirm = () => {
        mutate(
            { id: data!.id, isActive: data!.isActive },
            {
                onSuccess: () => {
                    setSuspendModalOpen(false)
                    toast.push(
                        <Notification
                            title={data?.isActive ? t('users.userDetails.notifications.suspendedSuccess') : t('users.userDetails.notifications.activatedSuccess')}
                            type="success"
                        />
                    )
                },
                onError: (error) => {
                    toast.push(<Notification title={getApiErrorMessage(error)} type="danger" />)
                }
            }
        )
    }

    return (
        <BackgroundRounded>
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                    <Avatar
                        src={data?.image}
                        shape="circle"
                        size={100}
                        className="!w-[100px] !h-[100px]"
                    />
                    <div className="text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <h2 className="text-xl sm:text-2xl font-semibold ">
                                {data?.companyName || (data?.firstName + ' ' + data?.lastName)}
                            </h2>
                            <StatusPill
                                variant={getSellerStatusVariant(data?.status)}
                                label={getSellerStatusLabel(data?.status)}
                                size="sm"
                            />
                        </div>

                        <AccountId id={data?.id} />

                        <UserInfoMeta
                            location={data?.region}
                            joinedDate={date}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                    <Button
                        variant="solid"
                        color='red'
                        onClick={() => setSuspendModalOpen(true)}
                    >
                        {t('users.userDetails.actions.suspendUser')}
                    </Button>
                    <SellerDropdownOptions
                        id={data?.id}
                        firstName={data?.firstName}
                        lastName={data?.lastName}
                        onAction={handleSellerAction}
                    />
                </div>
            </div>

            <SuspendUserModal
                dialogIsOpen={suspendModalOpen}
                firstName={data?.firstName}
                lastName={data?.lastName}
                isActive={data?.isActive}
                onDialogClose={() => setSuspendModalOpen(false)}
                onDialogConfirm={onSuspendConfirm}
                isLoading={isPending}
            />
        </BackgroundRounded>
    )
}

export default SellerInfo
