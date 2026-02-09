import { useTranslation } from 'react-i18next'
import Avatar from '@/components/ui/Avatar'
import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineLogout, HiOutlineUser } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'
import type { JSX } from 'react'
import { useGetProfile } from '@/api/hooks/auth'
import { Skeleton } from '../ui'

type DropdownList = {
    label: string
    path: string
    icon: JSX.Element
}

const _UserDropdown = ({ className }: CommonProps) => {
    const { t } = useTranslation()
    const { signOut } = useAuth()
    const { data, isLoading, isError } = useGetProfile()
    const dataProfile = data?.data

    const dropdownItemList: DropdownList[] = [
        {
            label: t('userDropdown.profile'),
            path: '/settings/profile',
            icon: <HiOutlineUser />,
        },
    ]
    const UserAvatar = !isError && (
        <>
            {' '}
            <div className={classNames(className, 'flex items-center gap-2')}>
                <Avatar size={32} shape="circle" icon={<HiOutlineUser />} />
                <div className="min-w-0 w-[92px]">
                    <div className="text-xs capitalize truncate ">
                        {!isLoading ? (
                            dataProfile?.role
                        ) : (
                            <Skeleton className="w-23 h-3 my-[2px]" />
                        )}
                    </div>

                    <div className="font-bold truncate">
                        {!isLoading ? (
                            dataProfile?.email
                        ) : (
                            <Skeleton className="w-25 h-3 " />
                        )}
                    </div>
                </div>
            </div>{' '}
        </>
    )

    return (
        <div>
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={UserAvatar}
                placement="bottom-end"
            >
                {!isError && (
                    <Dropdown.Item variant="header">
                        <div className="py-2 px-3 flex items-center gap-2">
                            <Avatar shape="circle" icon={<HiOutlineUser />} />
                            <div>
                                <div className="font-bold text-gray-900 dark:text-gray-100">
                                    {dataProfile
                                        ? dataProfile.email
                                        : 'user01@mail.com'}
                                </div>
                                <div className="text-xs">
                                    {dataProfile ? dataProfile.role : 'admin'}
                                </div>
                            </div>
                        </div>
                        <Dropdown.Item variant="divider" />
                    </Dropdown.Item>
                )}

                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <Link
                            className="flex h-full w-full px-2"
                            to={item.path}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                        </Link>
                    </Dropdown.Item>
                ))}
                <Dropdown.Item variant="divider" />
                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={signOut}
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>{t('userDropdown.signOut')}</span>
                </Dropdown.Item>
            </Dropdown>
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
