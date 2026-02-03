import { Breadcrumb } from '@/components/ui'
import { useTranslation } from 'react-i18next'
import FormModel from '../components/FormModel'

const CreateModel = () => {
    const { t } = useTranslation()

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.models'), path: '/models' },
                    { label: t('models.create.title') },
                ]}
            />
            <FormModel />
        </>
    )
}

export default CreateModel
