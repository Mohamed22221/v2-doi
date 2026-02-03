import BackgroundRounded from '@/components/shared/BackgroundRounded'
import InfoRow from '@/components/shared/cards/InfoRow'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import SectionHeader from '@/components/shared/cards/SectionHeader'

interface Props {
    buyer?: {
        id: string
        name: string
        phone: string
    }
}

const BuyerInfo = ({ buyer }: Props) => {
    const { t } = useTranslation()

    return (
        <BackgroundRounded>
            <div className="p-6">
                <SectionHeader title={t('orders.details.buyerInfo')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-primary-500 dark:text-primary-200 font-medium">
                            {t('orders.details.buyerId')}
                        </span>
                        <Link
                            to={`/users/${buyer?.id}`}
                            className=" hover:underline font-medium text-blue-400"
                        >
                            {buyer?.id}
                        </Link>
                    </div>

                    <InfoRow
                        label={t('orders.details.buyerName')}
                        value={buyer?.name}
                    />

                    <InfoRow
                        label={t('users.table.columns.phone')}
                        value={buyer?.phone}
                    />
                </div>
            </div>
        </BackgroundRounded>
    )
}

export default BuyerInfo
