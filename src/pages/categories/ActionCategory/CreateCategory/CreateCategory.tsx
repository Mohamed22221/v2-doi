import { lazy, Suspense } from 'react'
import FormCategorySkeleton from '../components/FormCategorySkeleton'
import { Breadcrumb } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const FormCategory = lazy(() => import('../components/FormCategory'))

const CreateCategory = () => {
    const { t } = useTranslation()

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.categories'), path: '/categories' },
                    { label: t('categories.create.title') },
                ]}
            />
            <Suspense fallback={<FormCategorySkeleton />}>
                <FormCategory />
            </Suspense>
        </>
    )
}

export default CreateCategory
