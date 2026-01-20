import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import BackgroundRounded from '@/components/shared/BackgroundRounded'
import { lazy, Suspense } from 'react'
import FormUpdateSkeleton from './components/FormUpdateSkeleton'

const FormUpdate = lazy(() => import('./components/FormUpdate'))

const UpdateUser = () => {
    const { id } = useParams()
    const { t } = useTranslation()

    const isUpdateMode = Boolean(id)

    return (
        <div>
            <BackgroundRounded className="p-6">
                {/* Title */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold">
                        {isUpdateMode
                            ? t('users.update.title') // مثال: "Update User"
                            : t('users.create.title')}
                    </h3>

                    <p className="text-sm text-gray-500">
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
