import { useGetUserDetails } from '@/api/hooks/users'
import { lazy, Suspense } from 'react'
import { useTranslation } from 'react-i18next'

import UserInfoSkeleton from '@/components/shared/loaders/UserInfoSkeleton'
import { useParams } from 'react-router-dom'
// import AccountStatisticsCard from './components/AccountStatisticsCard'
import { formatDateTime } from '@/utils/formatDateTime'
import StatusPill from '@/components/shared/table/StatusPill'
import PersonalAndShippingCardSkeleton from '@/components/shared/loaders/PersonalAndShippingCardSkeleton'
import ErrorState from '@/components/shared/ErrorState'

const UserInfo = lazy(() => import('./components/UserInfo'))
const PersonalAndShippingCard = lazy(
    () => import('./components/PersonalAndShippingCard'),
)

const DetailsUserSkeleton = () => (
    <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-12 mt-5">
            <PersonalAndShippingCardSkeleton />
        </div>
    </div>
)

const DetailsUserPage = () => {
    const { t } = useTranslation()
    const { id } = useParams()
    const { data, isError, isLoading, error } = useGetUserDetails(id!)

    if (isError) {
        return (
            <div>
                <ErrorState message={error?.message} fullPage={true} />
            </div>
        )
    }

    const { date, time } = formatDateTime(data?.data?.createdAt || '')

    const primaryAddress = data?.data?.addresses?.find(
        (address) => address.isPrimary === true,
    )
    return (
        <div>
            <Suspense fallback={<UserInfoSkeleton />}>
                {isLoading ? (
                    <UserInfoSkeleton />
                ) : (
                    <UserInfo
                        data={data?.data}
                        primaryAddress={primaryAddress}
                    />
                )}
            </Suspense>

            <Suspense fallback={<DetailsUserSkeleton />}>
                {isLoading ? (
                    <DetailsUserSkeleton />
                ) : (
                    <div className="grid gap-6 lg:grid-cols-12">
                        {/* Left big card */}
                        <div className="lg:col-span-12 mt-5">
                            <PersonalAndShippingCard
                                email={data?.data?.email}
                                phone={data?.data?.phone}
                                isPhoneVerified={data?.data?.isPhoneVerified}
                                isEmailVerified={data?.data?.isEmailVerified}
                                registrationDate={`${date}-${time}`}
                                accountStatus={
                                    <StatusPill
                                        value={data?.data?.isActive}
                                        activeText={t(
                                            'users.table.status.active',
                                        )}
                                        inactiveText={t(
                                            'users.table.status.blocked',
                                        )}
                                        size="sm"
                                    />
                                }
                                primaryAddress={primaryAddress}
                                country={t('address.country.sa')}
                            />
                        </div>

                        {/* Right column */}
                        {/* <div className="lg:col-span-4 space-y-6 mt-5">
                            <AccountStatisticsCard
                                totalSpent="$2,450.00"
                                totalOrders="24"
                            />
                        </div> */}
                    </div>
                )}
            </Suspense>
        </div>
    )
}

export default DetailsUserPage
