import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {
    Input,
    FormItem,
    FormContainer,
    Dialog,
    Notification,
    toast,
    Select,
} from '@/components/ui'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    StatusModalConfig,
} from '@/components/shared/StatusModal'
import { useCreateArea, useUpdateArea } from '@/api/hooks/areas'
import { useGetAllCities } from '@/api/hooks/cities'
import { getApiErrorMessage } from '@/api/error'
import { Area } from '@/api/types/areas'

type AreaUpsertModalProps = {
    isOpen: boolean
    onClose: () => void
    area?: Area | null
    onSuccess?: () => void
}

const AreaUpsertModal = ({
    isOpen,
    onClose,
    area,
    onSuccess,
}: AreaUpsertModalProps) => {
    const { t, i18n } = useTranslation()
    const isEdit = Boolean(area?.id)
    const isAr = i18n.language === 'ar'

    const { mutateAsync: createArea, isPending: isCreating } = useCreateArea()
    const { mutateAsync: updateArea, isPending: isUpdating } = useUpdateArea()
    const { cities, isLoading: isCitiesLoading } = useGetAllCities()

    const initialValues = {
        name: area?.name || '',
        nameAr: area?.nameAr || '',
        cityId: area?.cityId || '',
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required(t('locations.areas.modal.errors.nameRequired')),
        nameAr: Yup.string().trim().required(t('locations.areas.modal.errors.nameArRequired')),
        cityId: Yup.string().required(t('locations.areas.modal.errors.cityRequired')),
    })

    const onSubmit = async (values: typeof initialValues) => {
        try {
            if (isEdit && area?.id) {
                await updateArea({ id: area.id, data: values as any })
                toast.push(
                    <Notification
                        title={t('locations.areas.modal.success.edit')}
                        type="success"
                    />
                )
            } else {
                await createArea(values as any)
                toast.push(
                    <Notification
                        title={t('locations.areas.modal.success.create')}
                        type="success"
                    />
                )
            }
            onSuccess?.()
            onClose()
        } catch (error) {
            toast.push(
                <Notification
                    title={getApiErrorMessage(error)}
                    type="danger"
                />
            )
        }
    }

    const cityOptions = cities.map((city: any) => ({
        label: isAr ? city.nameAr : city.name,
        value: city.id,
    }))

    const config: StatusModalConfig = {
        title: isEdit
            ? t('locations.areas.modal.editTitle')
            : t('locations.areas.modal.createTitle'),
        description: '',
        confirmText: isEdit
            ? t('locations.areas.modal.actions.edit')
            : t('locations.areas.modal.actions.create'),
        confirmVariant: 'solid',
        confirmColor: 'primary',
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            onRequestClose={onClose}
            width={600}
        >
            <ModalHeader config={config} />
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ touched, errors, values, setFieldValue, isSubmitting }) => {
                    const isPending = isCreating || isUpdating || isSubmitting

                    return (
                        <Form>
                            <ModalBody>
                                <FormContainer>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem
                                            label={t('locations.areas.modal.fields.nameLabel')}
                                            invalid={Boolean(touched.name && errors.name)}
                                            errorMessage={errors.name}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="name"
                                                placeholder={t('locations.areas.modal.fields.namePlaceholder')}
                                                component={Input}
                                            />
                                        </FormItem>

                                        <FormItem
                                            label={t('locations.areas.modal.fields.nameArLabel')}
                                            invalid={Boolean(touched.nameAr && errors.nameAr)}
                                            errorMessage={errors.nameAr}
                                        >
                                            <Field
                                                type="text"
                                                autoComplete="off"
                                                name="nameAr"
                                                placeholder={t('locations.areas.modal.fields.nameArPlaceholder')}
                                                component={Input}
                                            />
                                        </FormItem>
                                    </div>

                                    <FormItem
                                        label={t('locations.areas.modal.fields.cityLabel')}
                                        invalid={Boolean(touched.cityId && errors.cityId)}
                                        errorMessage={errors.cityId}
                                    >
                                        <Select
                                            placeholder={t('locations.areas.modal.fields.cityPlaceholder')}
                                            options={cityOptions}
                                            isLoading={isCitiesLoading}
                                            value={cityOptions.find(option => option.value === values.cityId)}
                                            onChange={(option) => {
                                                if (option) {
                                                    setFieldValue('cityId', option.value)
                                                }
                                            }}
                                        />
                                    </FormItem>
                                </FormContainer>
                            </ModalBody>
                            <ModalFooter
                                config={config}
                                onClose={onClose}
                                isPending={isPending}
                            />
                        </Form>
                    )
                }}
            </Formik>
        </Dialog>
    )
}

export default AreaUpsertModal
