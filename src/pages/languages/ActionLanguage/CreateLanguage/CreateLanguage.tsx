import { lazy, Suspense } from 'react'
import FormLanguageSkeleton from '../components/FormLanguageSkeleton'

const FormLanguage = lazy(() => import('../components/FormLanguage'))

const CreateLanguage = () => {
    return (
        <Suspense fallback={<FormLanguageSkeleton />}>
            <FormLanguage />
        </Suspense>
    )
}

export default CreateLanguage
