import { useTranslation } from 'react-i18next'
import { Breadcrumb } from '@/components/ui'
import FormModel from '../components/FormModel'

const UpdateModel = () => {
    const { t } = useTranslation()

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t('nav.models'), path: '/models' },
                    { label: t('models.update.title') },
                ]}
            />
            <FormModel />
        </>
    )
}

export default UpdateModel
