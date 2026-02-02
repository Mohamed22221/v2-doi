import React, { useState } from 'react'
import { Avatar, Button, toast, Notification } from '@/components/ui'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import StatusPill from '@/components/shared/table/StatusPill'
import { useTranslation } from 'react-i18next'
import { formatDateTime } from '@/utils/formatDateTime'
import { getSellerStatusLabel, getSellerStatusVariant } from '@/pages/sellers/components/GetSellerStatusLabel'
import SellerDropdownOptions, { SellerAction } from './SellerDropdownOptions'
import SuspendUserModal from '@/pages/users/DetailsUser/components/SuspendUserModal'
import { useToggleUserStatus } from '@/api/hooks/users'
import { getApiErrorMessage } from '@/api/error'
import RestoreUser from '@/pages/users/DetailsUser/components/RestoreUser'

import AccountId from '@/components/shared/cards/AccountId'
import UserInfoMeta from '@/components/shared/cards/UserInfoMeta'

import { SellerItem } from '../../data/sellers.mock'

type Props = {
    data?: SellerItem
}

const SellerInfo = ({ data }: Props) => {
    const { t } = useTranslation()
    const { date } = formatDateTime(data?.user?.createdAt || '')
    const [dialogIsOpen, setIsOpen] = useState(false)
    const { mutate, isPending } = useToggleUserStatus()

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const handleSellerAction = (action: SellerAction) => {
        console.log('Seller action:', action)
        // Implementation for approve/reject would go here
    }

    const onDialogOk = () => {
        mutate(
            { id: data!.user.id, isActive: data!.user.isActive },
            {
                onSuccess: () => {
                    onDialogClose()
                    toast.push(
                        <Notification
                            title={
                                data?.user?.isActive
                                    ? t('users.userDetails.notifications.suspendedSuccess')
                                    : t('users.userDetails.notifications.activatedSuccess')
                            }
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
                                variant={getSellerStatusVariant(data?.status)}
                                label={getSellerStatusLabel(data?.status)}
                                size="sm"
                            />
                        </div>

                        <AccountId id={data?.id || ''} />

                        <UserInfoMeta
                            location={data?.user?.region}
                            joinedDate={date}
                        />
                    </div>
                </div>

                {/* Right Side Actions */}
                {data?.user?.deletedAt === null && (
                    <div className="flex w-full items-center flex-row justify-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
                        <Button
                            color={data?.user?.isActive ? 'red' : 'green'}
                            onClick={() => openDialog()}
                            variant="solid"
                        >
                            {data?.user?.isActive
                                ? t('users.userDetails.actions.suspendUser')
                                : t('users.userDetails.actions.activateUser')}
                        </Button>
                        <SellerDropdownOptions
                            id={data?.id || ''}
                            firstName={data?.user?.firstName || ''}
                            lastName={data?.user?.lastName || ''}
                            status={data?.status}
                            onAction={handleSellerAction}
                        />
                    </div>
                )}

                <SuspendUserModal
                    dialogIsOpen={dialogIsOpen}
                    firstName={data?.user?.firstName}
                    lastName={data?.user?.lastName}
                    isActive={data?.user?.isActive}
                    onDialogClose={onDialogClose}
                    onDialogConfirm={onDialogOk}
                    isLoading={isPending}
                />
            </div>
            {data?.user?.deletedAt != null && (
                <RestoreUser
                    firstName={data?.user?.firstName}
                    lastName={data?.user?.lastName}
                    id={data?.user?.id}
                />
            )}
        </BackgroundRounded>
    )
}

export default SellerInfo
