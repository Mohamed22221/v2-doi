import { lazy, Suspense } from 'react'
import FormBrandSkeleton from '../components/FormBrandSkeleton'

const FormBrand = lazy(() => import('../components/FormBrand'))

const CreateBrand = () => {
    return (

        <Suspense fallback={<FormBrandSkeleton />}>
            <FormBrand />
        </Suspense>

    )
}

export default CreateBrand
