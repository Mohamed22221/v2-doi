import { useTranslation } from 'react-i18next'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import {
    Dialog,
    FormContainer,
    FormItem,
    Input,
    Notification,
    toast,
} from '@/components/ui'
import {
    ModalHeader,
    ModalBody,
    ModalFooter,
    StatusModalConfig,
} from '@/components/shared/StatusModal'
import { useCreateRegion, useUpdateRegion } from '@/api/hooks/regions'
import { getApiErrorMessage } from '@/api/error'
import { Region } from '@/api/types/regions'
import Icon from '@/components/ui/Icon/Icon'

type RegionUpsertModalProps = {
    isOpen: boolean
    onClose: () => void
    region?: Region | null
}

/**
 * RegionUpsertModal Component
 * Handles both creating and updating a region.
 * Follows the pattern of ProductApproveModal for the modal wrapper.
 */
const RegionUpsertModal = ({
    isOpen,
    onClose,
    region,
}: RegionUpsertModalProps) => {
    const { t } = useTranslation()
    const isEdit = Boolean(region)

    const { mutateAsync: createRegion, isPending: isCreating } = useCreateRegion()
    const { mutateAsync: updateRegion, isPending: isUpdating } = useUpdateRegion()

    const initialValues = {
        name: region?.name || '',
        nameAr: region?.nameAr || '',
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required(t('locations.regions.modal.errors.nameRequired')),
        nameAr: Yup.string().trim().required(t('locations.regions.modal.errors.nameArRequired')),
    })

    const onSubmit = async (values: typeof initialValues) => {
        try {
            if (isEdit && region) {
                await updateRegion({ id: region.id, data: values })
                toast.push(
                    <Notification
                        title={t('locations.regions.modal.success.edit')}
                        type="success"
                    />
                )
            } else {
                await createRegion(values)
                toast.push(
                    <Notification
                        title={t('locations.regions.modal.success.create')}
                        type="success"
                    />
                )
            }
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

    const config: StatusModalConfig = {
        title: isEdit
            ? t('locations.regions.modal.editTitle')
            : t('locations.regions.modal.createTitle'),
        description: '',
        // icon: <Icon name="locationNav" />,
        confirmText: isEdit
            ? t('locations.regions.modal.actions.edit')
            : t('locations.regions.modal.actions.create'),
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
                {({ touched, errors, isSubmitting }) => {
                    const isPending = isCreating || isUpdating || isSubmitting

                    return (
                        <Form>
                            <ModalBody>
                                <FormContainer>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormItem
                                            label={t('locations.regions.modal.fields.nameLabel')}
                                            invalid={Boolean(touched.name && errors.name)}
                                            errorMessage={errors.name}
                                        >
                                            <Field
                                                name="name"
                                                component={Input}
                                                placeholder={t('locations.regions.modal.fields.namePlaceholder')}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label={t('locations.regions.modal.fields.nameArLabel')}
                                            invalid={Boolean(touched.nameAr && errors.nameAr)}
                                            errorMessage={errors.nameAr}
                                        >
                                            <Field
                                                name="nameAr"
                                                component={Input}
                                                placeholder={t('locations.regions.modal.fields.nameArPlaceholder')}
                                            />
                                        </FormItem>
                                    </div>
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

export default RegionUpsertModal
