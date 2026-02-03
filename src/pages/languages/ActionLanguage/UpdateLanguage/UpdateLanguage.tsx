import { lazy, Suspense } from 'react'
import FormLanguageSkeleton from '../components/FormLanguageSkeleton'
import { Breadcrumb } from '@/components/ui'
import { useTranslation } from 'react-i18next'

const FormLanguage = lazy(() => import('../components/FormLanguage'))

const UpdateLanguage = () => {
    const { t } = useTranslation()

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.languages'), path: '/languages' },
                    { label: t('languages.update.title') },
                ]}
            />
            <Suspense fallback={<FormLanguageSkeleton />}>
                <FormLanguage />
            </Suspense>
        </>
    )
}

export default UpdateLanguage
