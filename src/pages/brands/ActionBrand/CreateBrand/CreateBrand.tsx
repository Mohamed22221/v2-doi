import { lazy, Suspense } from 'react'
import FormBrandSkeleton from '../components/FormBrandSkeleton'
import { Breadcrumb } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const FormBrand = lazy(() => import('../components/FormBrand'))

const CreateBrand = () => {
    const { t } = useTranslation()

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.brands'), path: '/brands' },
                    { label: t('brands.create.title') },
                ]}
            />
            <Suspense fallback={<FormBrandSkeleton />}>
                <FormBrand />
            </Suspense>
        </>
    )
}

export default CreateBrand
