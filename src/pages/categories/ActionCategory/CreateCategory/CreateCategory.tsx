import { lazy, Suspense } from 'react'
import FormCategorySkeleton from '../components/FormCategorySkeleton'

const FormCategory = lazy(() => import('../components/FormCategory'))

const CreateCategory = () => {
    return (
   
            <Suspense fallback={<FormCategorySkeleton />}>
                <FormCategory />
            </Suspense>
      
    )
}

export default CreateCategory
