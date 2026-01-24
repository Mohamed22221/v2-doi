import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps, Form, Formik } from 'formik'

// UI
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import {
    Notification,
    toast,
    FormContainer,
    FormItem,
} from '@/components/ui'

// API hooks
import {
    useCreateLanguage,
    useGetLanguageById,
    useUpdateLanguage,
} from '@/api/hooks/languages'
import { getApiErrorMessage } from '@/api/error'

// Validation
import getLanguageValidationSchema from './schema'

// Components
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import Icon from '@/components/ui/Icon/Icon'
import FormLanguageSkeleton from './FormLanguageSkeleton'

// Types
import type { LanguagePayload } from '@/api/types/languages'
import ErrorState from '@/components/shared/ErrorState'

type FormValues = {
    name: string
    code: string
    isActive: boolean
}

const FormLanguage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdateMode = Boolean(id)
    const { t } = useTranslation()

    const {
        data: languageDetails,
        isLoading,
        isError,
        error
    } = useGetLanguageById(id as string, {
        enabled: isUpdateMode,
    })

    const { mutateAsync: createLanguage, isPending: isCreating } =
        useCreateLanguage()
    const { mutateAsync: updateLanguage, isPending: isUpdating } =
        useUpdateLanguage()

    const initialValues: FormValues = {
        name: '',
        code: '',
        isActive: true,
    }

    const handleSubmit = async (
        values: FormValues,
        setSubmitting: (v: boolean) => void,
    ) => {
        try {
            const payload: LanguagePayload = {
                name: values.name,
                code: values.code,
                isActive: values.isActive,
            }

            if (isUpdateMode && id) {
                await updateLanguage({ id, payload })
                toast.push(
                    <Notification
                        title={t('languages.update.success')}
                        type="success"
                    />,
                )
            } else {
                await createLanguage(payload)
                toast.push(
                    <Notification
                        title={t('languages.create.success')}
                        type="success"
                    />,
                )
            }
            navigate('/languages')
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

    if (isLoading) return <FormLanguageSkeleton />
    if (isError) return <ErrorState message={error?.message} fullPage />

    return (
        <Formik
            enableReinitialize
            initialValues={
                isUpdateMode && languageDetails?.data
                    ? {
                        name: languageDetails.data.name,
                        code: languageDetails.data.code,
                        isActive: languageDetails.data.isActive,
                    }
                    : initialValues
            }
            validationSchema={getLanguageValidationSchema(t)}
            onSubmit={(values, { setSubmitting }) =>
                handleSubmit(values, setSubmitting)
            }
        >
            {({
                touched,
                errors,
                isSubmitting,
                values,
            }) => {
                const submitting = isSubmitting || isCreating || isUpdating

                return (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2 space-y-4">
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('languages.generalInformation')}
                                            icon={<Icon name="info" />}
                                        />

                                        <div className="pt-3">
                                            <FormItem
                                                asterisk
                                                label={t('languages.table.columns.name')}
                                                invalid={Boolean(touched.name && errors.name)}
                                                errorMessage={errors.name}
                                            >
                                                <Field
                                                    name="name"
                                                    component={Input}
                                                    placeholder={t('languages.namePlaceholder')}
                                                />
                                            </FormItem>

                                            <FormItem
                                                asterisk
                                                label={t('languages.table.columns.code')}
                                                invalid={Boolean(touched.code && errors.code)}
                                                errorMessage={errors.code}
                                            >
                                                <Field
                                                    name="code"
                                                    component={Input}
                                                    placeholder={t('languages.codePlaceholder')}
                                                />
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>
                                </div>

                                <div className="lg:col-span-1 space-y-4">
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('languages.publishing')}
                                            icon={<Icon name="show" />}
                                        />

                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${values.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <label className="text-sm font-medium">
                                                    {t('languages.activeStatus')}
                                                </label>
                                            </div>
                                            <Field name="isActive">
                                                {({ field, form }: FieldProps) => (
                                                    <Switcher
                                                        checked={field.value}
                                                        onChange={(checked) => {
                                                            form.setFieldValue(field.name, checked)
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </div>
                                    </BackgroundRounded>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <Button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={submitting}
                                >
                                    {t('common.cancelChanges')}
                                </Button>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    loading={submitting}
                                    disabled={submitting}
                                >
                                    {isUpdateMode
                                        ? t('languages.update.submit')
                                        : t('languages.create.submit')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormLanguage
