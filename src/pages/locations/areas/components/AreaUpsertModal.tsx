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
import { useGetAllCitiesSelect } from '@/api/hooks/cities'
import { getApiErrorMessage } from '@/api/error'
import { Area } from '@/api/types/areas'
import useDebouncedValue from '@/utils/hooks/useDebouncedValue'
import { useMemo, useState } from 'react'

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

    const [searchQuery, setSearchQuery] = useState('')
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 500)

    const { mutateAsync: createArea, isPending: isCreating } = useCreateArea()
    const { mutateAsync: updateArea, isPending: isUpdating } = useUpdateArea()

    const {
        data: cities,
        isLoading: isCitiesLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isError,
    } = useGetAllCitiesSelect(debouncedSearchQuery)

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

    const initialCityOption = useMemo(() => {
        if (!isEdit || !area?.cityId) return null
        return {
            label: isAr ? (area.city?.nameAr ?? '') : (area.city?.name ?? ''),
            value: area.cityId,
        }
    }, [isEdit, area, isAr])

    const cityOptions = useMemo(() => {
        const options = cities?.items?.map((c) => ({
            label: isAr ? c?.nameAr : c?.name,
            value: c?.id,
        })) || []

        // Prepend the initial option if it isn't in the loaded list yet
        if (initialCityOption && !options.some((o) => o.value === initialCityOption.value)) {
            return [initialCityOption, ...options]
        }
        return options
    }, [cities, isAr, initialCityOption])

    const resolvedPlaceholder = useMemo(() => {
        if (isError) return t('locations.areas.modal.fields.cityErrorPlaceholder')
        return t('locations.areas.modal.fields.cityPlaceholder')
    }, [isError, t])

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
                                            placeholder={resolvedPlaceholder}
                                            options={cityOptions}
                                            value={cityOptions.find((opt) => opt.value === values.cityId) ?? null}
                                            onChange={(opt) => setFieldValue('cityId', opt?.value ?? '')}
                                            isLoading={isCitiesLoading}
                                            hasMore={hasNextPage}
                                            isLoadingMore={isFetchingNextPage}
                                            onLoadMore={() => fetchNextPage()}
                                            onInputChange={(val) => setSearchQuery(val)}
                                            loadMoreLabel={t('viewTable.filters.loadMore')}
                                            isClearable
                                            isSearchable
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
