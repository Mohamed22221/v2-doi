import { UserItem } from '@/api/types/users'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import StatusPill from '@/components/shared/table/StatusPill'
import { Avatar, Button } from '@/components/ui'
import Icon from '@/components/ui/Icon/Icon'
import { formatDateTime } from '@/utils/formatDateTime'
import React from 'react'

type Props = {
    data: UserItem | undefined
}
const UserInfo = ({ data }: Props) => {
    const { date } = formatDateTime(data?.createdAt || '')
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
                            <span className="absolute bottom-2 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 border-2 border-white">
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
                                activeText="Verified"
                                inactiveText="Not Verified"
                                size="sm"
                            />
                            {data?.role?.name && (
                                <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                    {data.role.name}
                                </span>
                            )}
                        </div>

                        <div className="mt-1  sm:flex  items-center justify-center gap-1 sm:justify-start">
                            <p className="text-primary-700 dark:text-primary-200">
                                Account ID:
                            </p>
                            <span className="font-medium text-black dark:text-white">
                                {data?.id}
                            </span>
                        </div>

                        <div className="mt-2 flex flex-col items-center gap-2 text-sm text-neutral-400 sm:flex-row sm:items-center sm:gap-4">
                            <span className="flex items-center gap-1">
                                <Icon name="location" /> Riyadh, Al-Malaz
                            </span>
                            <span className="flex items-center gap-1">
                                <Icon name="date" /> Joined {date}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-end">
                    <Button className="w-full sm:w-auto text-red-500 hover:bg-red-50 transition">
                        Suspend User
                    </Button>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default UserInfo
