import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {
    Input,
    Button as UIButton,
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
import { useCreateCity, useUpdateCity } from '@/api/hooks/cities'
import { useGetAllRegions } from '@/api/hooks/regions'
import { getApiErrorMessage } from '@/api/error'
import { City } from '@/api/types/cities'
import Icon from '@/components/ui/Icon/Icon'

type CityUpsertModalProps = {
    isOpen: boolean
    onClose: () => void
    city: City | null
}

const CityUpsertModal = ({
    isOpen,
    onClose,
    city,
}: CityUpsertModalProps) => {
    const { t, i18n } = useTranslation()
    const isEdit = Boolean(city?.id)
    const isAr = i18n.language === 'ar'

    const { mutate: createCity, isPending: isCreating } = useCreateCity()
    const { mutate: updateCity, isPending: isUpdating } = useUpdateCity()
    const { regions, isLoading: isRegionsLoading } = useGetAllRegions()

    const initialValues = {
        name: city?.name || '',
        nameAr: city?.nameAr || '',
        regionId: city?.regionId || '',
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t('locations.cities.modal.errors.nameRequired')),
        nameAr: Yup.string().required(t('locations.cities.modal.errors.nameArRequired')),
        regionId: Yup.string().required(t('locations.cities.modal.errors.regionRequired')),
    })

    const onSubmit = (values: typeof initialValues) => {
        const payload = values

        if (isEdit && city?.id) {
            updateCity(
                { id: city.id, data: payload },
                {
                    onSuccess: () => {
                        toast.push(
                            <Notification
                                title={t('locations.cities.modal.success.edit')}
                                type="success"
                            />
                        )
                        onClose()
                    },
                    onError: (error) => {
                        toast.push(
                            <Notification
                                title={getApiErrorMessage(error)}
                                type="danger"
                            />
                        )
                    },
                }
            )
        } else {
            createCity(payload, {
                onSuccess: () => {
                    toast.push(
                        <Notification
                            title={t('locations.cities.modal.success.create')}
                            type="success"
                        />
                    )
                    onClose()
                },
                onError: (error) => {
                    toast.push(
                        <Notification
                            title={getApiErrorMessage(error)}
                            type="danger"
                        />
                    )
                },
            })
        }
    }

    const config: StatusModalConfig = {
        title: isEdit
            ? t('locations.cities.modal.editTitle')
            : t('locations.cities.modal.createTitle'),
        description: '',
        confirmText: isEdit
            ? t('locations.cities.modal.actions.edit')
            : t('locations.cities.modal.actions.create'),
        confirmVariant: 'solid',
        confirmColor: 'primary',
    }

    const regionOptions = regions?.map((r) => ({
        label: isAr ? r.nameAr : r.name,
        value: r.id,
    })) || []

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
                {({ touched, errors, isSubmitting, setFieldValue, values }) => {
                    const isPending = isCreating || isUpdating || isSubmitting

                    return (
                        <Form>
                            <ModalBody>
                                <FormContainer>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem
                                            label={t('locations.cities.modal.fields.nameLabel')}
                                            invalid={Boolean(touched.name && errors.name)}
                                            errorMessage={errors.name}
                                        >
                                            <Field
                                                name="name"
                                                component={Input}
                                                placeholder={t('locations.cities.modal.fields.namePlaceholder')}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label={t('locations.cities.modal.fields.nameArLabel')}
                                            invalid={Boolean(touched.nameAr && errors.nameAr)}
                                            errorMessage={errors.nameAr}
                                        >
                                            <Field
                                                name="nameAr"
                                                component={Input}
                                                placeholder={t('locations.cities.modal.fields.nameArPlaceholder')}
                                            />
                                        </FormItem>
                                    </div>
                                    <FormItem
                                        label={t('locations.cities.modal.fields.regionLabel')}
                                        invalid={Boolean(touched.regionId && errors.regionId)}
                                        errorMessage={errors.regionId}
                                    >
                                        <Select
                                            placeholder={t('locations.cities.modal.fields.regionPlaceholder')}
                                            options={regionOptions}
                                            value={regionOptions.find(opt => opt.value === values.regionId)}
                                            onChange={(opt) => setFieldValue('regionId', opt?.value)}
                                            isLoading={isRegionsLoading}
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

export default CityUpsertModal
