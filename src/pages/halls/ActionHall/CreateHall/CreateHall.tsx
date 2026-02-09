import { lazy, Suspense } from 'react'
import FormHallSkeleton from '../components/FormHallSkeleton'
import { Breadcrumb } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const FormHall = lazy(() => import('../components/FormHall'))

const CreateHall = () => {
    const { t } = useTranslation()

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.halls'), path: '/halls' },
                    { label: t('halls.create.title') },
                ]}
            />
            <Suspense fallback={<FormHallSkeleton />}>
                <FormHall />
            </Suspense>
        </>
    )
}

export default CreateHall
