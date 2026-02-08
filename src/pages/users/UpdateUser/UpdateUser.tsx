import { Breadcrumb, Icon } from '@/components/ui'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { lazy, Suspense } from 'react'
import FormUpdateSkeleton from './components/FormUpdateSkeleton'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'

const FormUpdate = lazy(() => import('./components/FormUpdate'))

const UpdateUser = () => {
    const { id } = useParams()
    const { t } = useTranslation()

    const isUpdateMode = Boolean(id)

    return (
        <div>
            <Breadcrumb
                items={[
                    { label: t('nav.users'), path: '/users' },
                    {
                        label: isUpdateMode
                            ? t('users.update.title')
                            : t('users.create.title'),
                    },
                ]}
            />
            <BackgroundRounded className="p-6">
                {/* Title */}
                <div className="mb-6">
                    <HeaderInformation
                        title={
                            isUpdateMode
                                ? t('users.update.title') // مثال: "Update User"
                                : t('users.create.title')
                        }
                        icon={<Icon name="info" />}
                    />

                    <p className="text-sm text-gray-500 mt-3">
                        {isUpdateMode
                            ? t('users.update.subtitle')
                            : t('users.create.subtitle')}
                    </p>
                </div>

                <Suspense fallback={<FormUpdateSkeleton />}>
                    <FormUpdate />
                </Suspense>
            </BackgroundRounded>
        </div>
    )
}

export default UpdateUser
