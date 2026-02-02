import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { lazy, Suspense } from 'react'
import FormUpdateSkeleton from './components/FormUpdateSkeleton'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import { Icon } from '@/components/ui'

const FormUpdate = lazy(() => import('./components/FormUpdate'))

const UpdateSeller = () => {
    const { id } = useParams()
    const { t } = useTranslation()

    const isUpdateMode = Boolean(id)

    return (
        <div>
            <BackgroundRounded className="p-6">
                {/* Title */}
                <div className="mb-6">
                    <HeaderInformation
                        title={
                            isUpdateMode
                                ? t('sellers.update.title')
                                : t('sellers.create.title')
                        }
                        icon={<Icon name="info" />}
                    />

                    <p className="text-sm text-gray-500 mt-3">
                        {isUpdateMode
                            ? t('sellers.update.subtitle')
                            : t('sellers.create.subtitle')}
                    </p>
                </div>

                <Suspense fallback={<FormUpdateSkeleton />}>
                    <FormUpdate />
                </Suspense>
            </BackgroundRounded>
        </div>
    )
}

export default UpdateSeller
