import { lazy, Suspense } from 'react'
import FormCategorySkeleton from '../components/FormCategorySkeleton'
import { useTranslation } from 'react-i18next'
import { Breadcrumb } from '@/components/ui'

const FormCategory = lazy(() => import('../components/FormCategory'))

const UpdateCategory = () => {
    const { t } = useTranslation()

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.categories'), path: '/categories' },
                    { label: t('categories.update.title') },
                ]}
            />
            <Suspense fallback={<FormCategorySkeleton />}>
                <FormCategory />
            </Suspense>
        </>
    )
}

export default UpdateCategory
