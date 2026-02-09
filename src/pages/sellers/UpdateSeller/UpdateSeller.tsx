import { Breadcrumb, Icon } from '@/components/ui'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense } from 'react'

// Shared Components
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'

// Local Components
import FormUpdateSkeleton from './components/FormUpdateSkeleton'

const FormUpdate = lazy(() => import('./components/FormUpdate'))

const UpdateSeller = () => {
    const { id } = useParams()
    const { t } = useTranslation()

    const isUpdateMode = Boolean(id)

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.sellers'), path: '/sellers' },
                    {
                        label: isUpdateMode
                            ? t('sellers.update.title')
                            : t('sellers.create.title'),
                    },
                ]}
            />
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
        </>
    )
}

export default UpdateSeller
