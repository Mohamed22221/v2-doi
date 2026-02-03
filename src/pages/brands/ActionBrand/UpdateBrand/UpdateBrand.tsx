import { lazy, Suspense } from 'react'
import FormBrandSkeleton from '../components/FormBrandSkeleton'
import { useTranslation } from 'react-i18next'
import { Breadcrumb } from '@/components/ui'

const FormBrand = lazy(() => import('../components/FormBrand'))

const UpdateBrand = () => {
    const { t } = useTranslation()

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.brands'), path: '/brands' },
                    { label: t('brands.update.title') },
                ]}
            />
            <Suspense fallback={<FormBrandSkeleton />}>
                <FormBrand />
            </Suspense>
        </>
    )
}

export default UpdateBrand
