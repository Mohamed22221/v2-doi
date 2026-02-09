import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps, Form, Formik } from 'formik'

// UI
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Notification, toast } from '@/components/ui'

// Hooks
import {
    useGetSellerDetails,
    useUpdateSeller,
} from '@/api/hooks/sellers'
import { getApiErrorMessage } from '@/api/error'

// Types
import { TSellerPayload } from '@/api/types/sellers'

// Validation
import getSellerValidationSchema from './schema'

// Components
import { PasswordInput } from '@/components/shared'
import ErrorState from '@/components/shared/ErrorState'
import SellerImageUpload from './SellerImageUpload'
import FormUpdateSkeleton from './FormUpdateSkeleton'

const FormUpdate = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdateMode = Boolean(id)
    const { t } = useTranslation()

    const {
        data: sellerDetails,
        isLoading,
        isError,
        error,
    } = useGetSellerDetails(id as string)

    const { mutateAsync: updateSeller, isPending: isUpdating } = useUpdateSeller()

    const initialValues: TSellerPayload = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        isActive: true,
        image: '',
        businessName: '',
        businessPhone: '',
        commercialRegistrationNumber: '',
    }

    const handleSubmit = async (
        values: TSellerPayload,
        setSubmitting: (v: boolean) => void,
    ) => {
        try {
            const payload = { ...values }
            if (isUpdateMode && !payload.password) {
                delete payload.password
            }

            if (isUpdateMode && id) {
                await updateSeller({ id, data: payload })
                toast.push(
                    <Notification
                        title={t('sellers.update.success')}
                        type="success"
                    />,
                )
                navigate(`/sellers/${id}`)
            }
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

    if (isLoading) {
        return <FormUpdateSkeleton />
    }

    if (isError) {
        return (
            <div>
                <ErrorState message={error?.message} fullPage={true} />
            </div>
        )
    }

    return (
        <Formik
            enableReinitialize
            initialValues={
                isUpdateMode && sellerDetails?.data
                    ? {
                        firstName: sellerDetails.data.user?.firstName ?? '',
                        lastName: sellerDetails.data.user?.lastName ?? '',
                        email: sellerDetails.data.user?.email ?? '',
                        phone: sellerDetails.data.user?.phone ?? '',
                        password: '',
                        isActive: sellerDetails.data.user?.isActive ?? true,
                        image: sellerDetails.data.user?.image ?? '',
                        businessName: sellerDetails.data.businessName ?? '',
                        businessPhone: sellerDetails.data.businessPhone ?? '',
                        commercialRegistrationNumber: sellerDetails.data.commercialRegistrationNumber ?? '',
                    }
                    : initialValues
            }
            validationSchema={getSellerValidationSchema(t, isUpdateMode)}
            onSubmit={(values, { setSubmitting }) =>
                handleSubmit(values, setSubmitting)
            }
        >
            {({ touched, errors, isSubmitting }) => {
                const submitting = isSubmitting || isUpdating
                return (
                    <Form>
                        <FormContainer>
                            <SellerImageUpload uploadType="seller_profile" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem
                                    asterisk
                                    label={t('sellers.firstName')}
                                    invalid={Boolean(
                                        touched.firstName &&
                                        errors.firstName,
                                    )}
                                    errorMessage={errors.firstName}
                                >
                                    <Field
                                        name="firstName"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label={t('sellers.lastName')}
                                    invalid={Boolean(
                                        touched.lastName && errors.lastName,
                                    )}
                                    errorMessage={errors.lastName}
                                >
                                    <Field
                                        name="lastName"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>

                            {/* Email + Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem
                                    asterisk
                                    label={t('sellers.email')}
                                    invalid={Boolean(
                                        touched.email && errors.email,
                                    )}
                                    errorMessage={errors.email}
                                >
                                    <Field name="email" component={Input} />
                                </FormItem>

                                <FormItem
                                    asterisk
                                    label={t('sellers.phone')}
                                    invalid={Boolean(
                                        touched.phone && errors.phone,
                                    )}
                                    errorMessage={errors.phone}
                                >
                                    <Field
                                        name="phone"
                                        component={Input}
                                        disabled={isUpdateMode}
                                    />
                                </FormItem>
                            </div>

                            {/* Business Name + Business Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem
                                    label={t('sellers.companyName')}
                                    invalid={Boolean(
                                        touched.businessName && errors.businessName,
                                    )}
                                    errorMessage={errors.businessName}
                                >
                                    <Field
                                        name="businessName"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    label={t('sellers.contactNumber')}
                                    invalid={Boolean(
                                        touched.businessPhone && errors.businessPhone,
                                    )}
                                    errorMessage={errors.businessPhone}
                                >
                                    <Field
                                        name="businessPhone"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>

                            {/* Commercial Registration + Password */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormItem
                                    label={t('sellers.commercialRegistrationNumber')}
                                    invalid={Boolean(
                                        touched.commercialRegistrationNumber && errors.commercialRegistrationNumber,
                                    )}
                                    errorMessage={errors.commercialRegistrationNumber}
                                >
                                    <Field
                                        name="commercialRegistrationNumber"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    asterisk={!isUpdateMode}
                                    label={t('sellers.password')}
                                    invalid={Boolean(
                                        touched.password && errors.password,
                                    )}
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        name="password"
                                        type="password"
                                        component={PasswordInput}
                                    />
                                </FormItem>
                            </div>

                            {/* Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <FormItem
                                    asterisk
                                    label={t('sellers.table.status.status')}
                                >
                                    <Field name="isActive">
                                        {({
                                            field,
                                            form,
                                        }: FieldProps<boolean>) => (
                                            <Switcher
                                                checked={
                                                    field.value === true
                                                }
                                                onChange={(checked) => {
                                                    form.setFieldValue(
                                                        field.name,
                                                        checked
                                                            ? true
                                                            : false,
                                                    )
                                                }}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            </div>

                            <div className="flex items-center gap-3 mt-6">
                                <Button
                                    type="button"
                                    variant="default"
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
                                    {t('sellers.update.submit')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormUpdate
