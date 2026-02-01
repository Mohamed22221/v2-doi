import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import StatusPill from '@/components/shared/table/StatusPill'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface SellerInfoCardProps {
    seller?: {
        id: string
        name: string
        phone: string
        status: 'active' | 'inactive'
    }
}

const SellerInfoCard = ({ seller }: SellerInfoCardProps) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6">
                <h3 className="text-base font-semibold text-neutral-300 mb-6">
                    {t('common.sellerInfo') || 'Seller Info'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-primary-500 dark:text-primary-200 font-medium">
                            {t('users.userDetails.accountId') || 'Seller ID'}
                        </span>
                        <Link
                            to={`/users/${seller?.id}`}
                            className=" hover:underline font-medium text-blue-400"
                        >
                            {seller?.id}
                        </Link>
                    </div>

                    <InfoRow
                        label={t('users.table.columns.name') || 'Seller Name'}
                        value={seller?.name}
                    />

                    <InfoRow
                        label={t('users.table.columns.phone') || 'Phone Number'}
                        value={seller?.phone}
                    />

                    <div className="flex flex-col gap-1">
                        <span className="text-primary-500 dark:text-primary-200 font-medium">
                            {t('users.table.columns.status') || 'Seller Status'}
                        </span>
                        <div>
                            <StatusPill
                                value={seller?.status === 'active'}
                                activeText={t('users.table.status.active')}
                                inactiveText={t('users.table.status.blocked')}
                                size="sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default SellerInfoCard
