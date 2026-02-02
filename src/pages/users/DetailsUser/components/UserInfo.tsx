import { ApiAddress, UserItem } from '@/api/types/users'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import StatusPill from '@/components/shared/table/StatusPill'
import { Avatar, Badge, Button, Notification, toast } from '@/components/ui'
import Icon from '@/components/ui/Icon/Icon'
import { formatDateTime } from '@/utils/formatDateTime'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SuspendUserModal from './SuspendUserModal'
import { useToggleUserStatus } from '@/api/hooks/users'
import { getApiErrorMessage } from '@/api/error'
import DropdownOptions from './DropdownOptions'
import { formatCityRegion } from '../utils/cityRegionFormatter'
import RestoreUser from './RestoreUser'

import AccountId from '@/components/shared/cards/AccountId'
import UserInfoMeta from '@/components/shared/cards/UserInfoMeta'

type Props = {
    data?: UserItem
    primaryAddress?: ApiAddress
}
const UserInfo = ({ data, primaryAddress }: Props) => {
    const { t } = useTranslation()
    const { date } = formatDateTime(data?.createdAt || '')
    const [dialogIsOpen, setIsOpen] = useState(false)
    const { mutate, isPending } = useToggleUserStatus()

    const openDialog = () => {
        setIsOpen(true)
    }

    const onDialogClose = () => {
        setIsOpen(false)
    }

    const onDialogOk = () => {
        mutate(
            { id: data!.id, isActive: data!.isActive },
            {
                onSuccess: () => {
                    onDialogClose()
                    toast.push(
                        <Notification
                            title={
                                data?.isActive
                                    ? t(
                                        'users.userDetails.notifications.suspendedSuccess',
                                    )
                                    : t(
                                        'users.userDetails.notifications.activatedSuccess',
                                    )
                            }
                            type="success"
                        />,
                    )
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

    return (
        <BackgroundRounded>
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Left Side */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    {/* Avatar */}
                    <div className="relative">
                        <Avatar
                            src={data?.image}
                            shape="circle"
                            size={80}
                            className="sm:!w-[100px] sm:!h-[100px]"
                        />
                        {data?.isPhoneVerified && (
                            <span className="absolute bottom-2 ltr:right-0 rtl:left-0 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 border-2 border-white">
                                <Icon name="check" className="text-white" />
                            </span>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-50">
                                {data?.firstName + ' ' + data?.lastName}
                            </h2>
                            <StatusPill
                                value={data?.isPhoneVerified}
                                activeText={t(
                                    'users.userDetails.status.verified',
                                )}
                                inactiveText={t(
                                    'users.userDetails.status.notVerified',
                                )}
                                size="sm"
                            />
                            {data?.role?.name && (
                                <Badge
                                    className="mr-4 border border-gray-400"
                                    content={data.role.name}
                                    innerClass="bg-white text-gray-500"
                                />
                            )}
                        </div>

                        <AccountId id={data?.id || ''} />

                        <UserInfoMeta
                            location={
                                primaryAddress
                                    ? formatCityRegion({
                                        address: primaryAddress,
                                        t,
                                    })
                                    : undefined
                            }
                            joinedDate={date}
                        />
                    </div>
                </div>

                {/* Right Side Actions */}
                {data?.deletedAt === null && (
                    <div className="flex w-full items-center flex-row justify-center gap-3 sm:w-auto sm:flex-row sm:justify-center">
                        <Button
                            color={data?.isActive ? 'red' : 'green'} // className="w-full sm:w-auto text-red-500 hover:bg-red-50 transition"
                            onClick={() => openDialog()}
                            variant="solid"
                        >
                            {data?.isActive
                                ? t('users.userDetails.actions.suspendUser')
                                : t('users.userDetails.actions.activateUser')}
                        </Button>
                        <DropdownOptions
                            firstName={data?.firstName || ''}
                            lastName={data?.lastName || ''}
                            id={data!.id}
                        />
                    </div>
                )}

                <SuspendUserModal
                    dialogIsOpen={dialogIsOpen}
                    firstName={data?.firstName}
                    lastName={data?.lastName}
                    isActive={data?.isActive}
                    onDialogClose={onDialogClose}
                    onDialogConfirm={onDialogOk}
                    isLoading={isPending}
                />
            </div>
            {data?.deletedAt != null && (
                <RestoreUser
                    firstName={data?.firstName}
                    lastName={data?.lastName}
                    id={data?.id}
                />
            )}
        </BackgroundRounded>
    )
}

export default UserInfo
