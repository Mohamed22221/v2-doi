import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Field, Form, Formik } from 'formik'

// UI
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
    Notification,
    toast,
    FormContainer,
    FormItem,
    DatePicker,
} from '@/components/ui'

// API hooks
import {
    useCreateModel,
    useGetModelById,
    useUpdateModel,
} from '@/api/hooks/models'
import { getApiErrorMessage } from '@/api/error'

// Validation
import getModelValidationSchema from './schema'

// Components
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import Icon from '@/components/ui/Icon/Icon'
import CategorySelect from '@/components/helpers/CategoriesSelect'
import BrandSelect from '@/components/helpers/BrandsSelect'

import FormModelSkeleton from './FormModelSkeleton'

// Types
import type { ModelPayload } from '@/api/types/models'

type ModelFormValues = {
    name: string
    brandId: string
    categoryId: string
    releaseYear: Date | number | null
    sortOrder: number
}

const FormModel = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdateMode = Boolean(id)
    const { t } = useTranslation()

    const { data: modelDetails, isLoading } = useGetModelById(id as string, {
        enabled: isUpdateMode,
    })

    const { mutateAsync: createModel, isPending: isCreating } = useCreateModel()
    const { mutateAsync: updateModel, isPending: isUpdating } = useUpdateModel()

    const initialValues: ModelFormValues = {
        name: '',
        brandId: '',
        categoryId: '',
        releaseYear: new Date(),
        sortOrder: 0,
    }

    const handleSubmit = async (
        values: ModelFormValues,
        setSubmitting: (v: boolean) => void,
    ) => {
        try {
            const payload: ModelPayload = {
                ...values,
                sortOrder: Number(values.sortOrder),
                releaseYear:
                    values.releaseYear instanceof Date
                        ? values.releaseYear.getFullYear()
                        : Number(values.releaseYear),
            } as ModelPayload // Ensure type matches after conversion

            if (isUpdateMode && id) {
                await updateModel({ id, payload })
                toast.push(
                    <Notification
                        title={t('models.update.success')}
                        type="success"
                    />,
                )
            } else {
                await createModel(payload)
                toast.push(
                    <Notification
                        title={t('models.create.success')}
                        type="success"
                    />,
                )
            }
            navigate('/models')
        } catch (error) {
            toast.push(
                <Notification
                    title={getApiErrorMessage(error)}
                    type="danger"
                />,
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (isLoading && isUpdateMode) return <FormModelSkeleton />

    return (
        <Formik
            enableReinitialize
            initialValues={
                isUpdateMode && modelDetails?.data
                    ? {
                          name: modelDetails.data.name,
                          brandId: modelDetails.data.brandId,
                          categoryId: modelDetails.data.categoryId,
                          releaseYear: modelDetails.data.releaseYear
                              ? new Date(modelDetails.data.releaseYear, 0, 1)
                              : null,
                          sortOrder: modelDetails.data.sortOrder,
                      }
                    : initialValues
            }
            validationSchema={getModelValidationSchema(t)}
            onSubmit={(values, { setSubmitting }) =>
                handleSubmit(values, setSubmitting)
            }
        >
            {({ touched, errors, isSubmitting, setFieldValue, values }) => {
                const submitting = isSubmitting || isCreating || isUpdating

                return (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2 space-y-4">
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t(
                                                'models.generalInformation',
                                            )}
                                            icon={<Icon name="info" />}
                                        />

                                        <div className="pt-3">
                                            <FormItem
                                                asterisk
                                                label={t('models.name')}
                                                invalid={Boolean(
                                                    touched.name && errors.name,
                                                )}
                                                errorMessage={errors.name}
                                            >
                                                <Field
                                                    name="name"
                                                    component={Input}
                                                    placeholder={t(
                                                        'models.nameAdd',
                                                    )}
                                                />
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>

                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('models.classification')}
                                            icon={
                                                <Icon name="classification" />
                                            }
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3">
                                            <FormItem
                                                asterisk
                                                label={t('models.brand')}
                                                invalid={Boolean(
                                                    touched.brandId &&
                                                        errors.brandId,
                                                )}
                                                errorMessage={errors.brandId}
                                            >
                                                <BrandSelect
                                                    value={values.brandId}
                                                    menuPortalZ={400}
                                                    onChange={(val) =>
                                                        setFieldValue(
                                                            'brandId',
                                                            val,
                                                        )
                                                    }
                                                />
                                            </FormItem>

                                            <FormItem
                                                asterisk
                                                label={t('models.category')}
                                                invalid={Boolean(
                                                    touched.categoryId &&
                                                        errors.categoryId,
                                                )}
                                                errorMessage={errors.categoryId}
                                            >
                                                <CategorySelect
                                                    value={values.categoryId}
                                                    onChange={(val) =>
                                                        setFieldValue(
                                                            'categoryId',
                                                            val,
                                                        )
                                                    }
                                                    placeholder={t(
                                                        'models.table.filters.allCategories',
                                                    )}
                                                />
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>
                                </div>

                                <div className="lg:col-span-1 space-y-4">
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('models.publishing')}
                                            icon={<Icon name="show" />}
                                        />

                                        <div className="py-3 mt-2">
                                            <FormItem
                                                asterisk
                                                label={t('models.releaseYear')}
                                                invalid={Boolean(
                                                    touched.releaseYear &&
                                                        errors.releaseYear,
                                                )}
                                                errorMessage={
                                                    errors.releaseYear as string
                                                }
                                            >
                                                <DatePicker
                                                    viewOnly="year"
                                                    inputFormat="YYYY"
                                                    minDate={
                                                        new Date(1900, 0, 1)
                                                    }
                                                    maxDate={new Date()}
                                                    placeholder={t(
                                                        'models.releaseYearPlaceholder',
                                                    )}
                                                    value={
                                                        values.releaseYear instanceof
                                                        Date
                                                            ? values.releaseYear
                                                            : null
                                                    }
                                                    onChange={(date) =>
                                                        setFieldValue(
                                                            'releaseYear',
                                                            date,
                                                        )
                                                    }
                                                />
                                            </FormItem>
                                        </div>

                                        <div className="py-3">
                                            <FormItem
                                                asterisk
                                                label={t('models.sortOrder')}
                                                invalid={Boolean(
                                                    touched.sortOrder &&
                                                        errors.sortOrder,
                                                )}
                                                errorMessage={errors.sortOrder}
                                            >
                                                <Field
                                                    name="sortOrder"
                                                    type="number"
                                                    component={Input}
                                                    placeholder={t(
                                                        'models.sortOrderPlaceholder',
                                                    )}
                                                />
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <Button
                                    type="button"
                                    disabled={submitting}
                                    onClick={() => navigate(-1)}
                                >
                                    {t('common.cancelChanges')}
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={submitting}
                                    disabled={submitting || isLoading}
                                >
                                    {isUpdateMode
                                        ? t('models.update.submit')
                                        : t('models.create.submit')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormModel
