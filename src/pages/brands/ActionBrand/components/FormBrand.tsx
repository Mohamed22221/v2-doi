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
    useCreateBrand,
    useGetBrandById,
    useUpdateBrand,
} from '@/api/hooks/brands'
import { getApiErrorMessage } from '@/api/error'

// Validation
import getBrandValidationSchema from './schema'

// Components
import BrandLogoUpload from './BrandLogoUpload'
import FormBrandSkeleton from './FormBrandSkeleton'
import ErrorState from '@/components/shared/ErrorState'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import Icon from '@/components/ui/Icon/Icon'
import LanguageSelect from '@/components/helpers/LanguageSelect'
import CategorySelect from '@/components/helpers/CategoriesSelect'
// Types
import type { BrandPayload, LanguageCode } from '@/api/types/brands'

type FormValues = {
    name: string
    description: string
    categoryId: string | null
    status: 'active' | 'inactive'
    logoUrl: string
    sortOrder: number
    language: string
    localTranslations: Record<string, { name: string; description: string }>
}

const FormBrand = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdateMode = Boolean(id)
    const { t } = useTranslation()

    const {
        data: brandDetails,
        isLoading,
        isError,
        error,
    } = useGetBrandById(id as string, {
        enabled: isUpdateMode,
    })

    const { mutateAsync: createBrand, isPending: isCreating } =
        useCreateBrand()
    const { mutateAsync: updateBrand, isPending: isUpdating } =
        useUpdateBrand()

    const initialValues: FormValues = {
        name: '',
        description: '',
        categoryId: null,
        status: 'active',
        logoUrl: '',
        sortOrder: 0,
        language: 'en',
        localTranslations: {},
    }

    const handleSubmit = async (
        values: FormValues,
        setSubmitting: (v: boolean) => void,
    ) => {
        try {
            // Final sync: save current visible fields to the store
            const finalStore = {
                ...values.localTranslations,
                [values.language]: {
                    name: values.name,
                    description: values.description,
                },
            }

            const translations = Object.entries(finalStore)
                .filter(([, v]) => v.name?.trim() || v.description?.trim())
                .map(([languageCode, v]) => ({
                    languageCode: languageCode as LanguageCode,
                    name: v.name || '',
                    description: v.description || '',
                }))

            const payload: BrandPayload = {
                translations,
                categoryId: values.categoryId || null,
                status: values.status,
                sortOrder: Number(values.sortOrder),
                logoUrl: values.logoUrl || null,
            }

            if (isUpdateMode && id) {
                await updateBrand({ id, payload })
                toast.push(
                    <Notification
                        title={t('brands.update.success')}
                        type="success"
                    />,
                )
            } else {
                await createBrand(payload)
                toast.push(
                    <Notification
                        title={t('brands.create.success')}
                        type="success"
                    />,
                )
            }
            navigate('/brands')
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

    if (isLoading) return <FormBrandSkeleton />
    if (isError) return <ErrorState message={error?.message} fullPage={true} />

    return (
        <Formik
            enableReinitialize
            initialValues={
                isUpdateMode && brandDetails?.data
                    ? {
                        ...initialValues,
                        categoryId: brandDetails.data.categoryId ?? null,
                        status: brandDetails.data.status ?? 'active',
                        logoUrl: brandDetails.data.logoUrl ?? '',
                        sortOrder: brandDetails.data.sortOrder ?? 0,
                        localTranslations:
                            brandDetails.data.translations?.reduce(
                                (acc: Record<string, { name: string; description: string }>, t) => {
                                    const lang = t.languageCode.toLowerCase()
                                    const entry = acc[lang] || { name: '', description: '' }

                                    if (t.field === 'name') entry.name = t.value
                                    if (t.field === 'description') entry.description = t.value

                                    return { ...acc, [lang]: entry }
                                },
                                {},
                            ) ?? {},
                        language:
                            brandDetails.data.translations?.[0]?.languageCode.toLowerCase() || 'en',
                        name:
                            brandDetails.data.translations?.find(
                                (t) => t.field === 'name' && t.languageCode.toLowerCase() === (brandDetails.data.translations?.[0]?.languageCode.toLowerCase() || 'en'),
                            )?.value || '',
                        description:
                            brandDetails.data.translations?.find(
                                (t) => t.field === 'description' && t.languageCode.toLowerCase() === (brandDetails.data.translations?.[0]?.languageCode.toLowerCase() || 'en'),
                            )?.value || '',
                    }
                    : initialValues
            }
            validationSchema={getBrandValidationSchema(t)}
            onSubmit={(values, { setSubmitting }) =>
                handleSubmit(values, setSubmitting)
            }
        >
            {({
                touched,
                errors,
                isSubmitting,
                setFieldValue,
                setValues,
                values,
            }) => {
                const submitting = isSubmitting || isCreating || isUpdating

                return (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Left Column - General Information & Media Assets */}
                                <div className="lg:col-span-2 space-y-4">
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t(
                                                'brands.generalInformation',
                                            )}
                                            icon={<Icon name="info" />}
                                            rightSlot={
                                                <LanguageSelect
                                                    value={values.language}
                                                    onChange={(lang) => {
                                                        if (!lang) return

                                                        // 1. Sync current buffer to store
                                                        const updatedStore = {
                                                            ...values.localTranslations,
                                                            [values.language]: {
                                                                name: values.name,
                                                                description: values.description,
                                                            },
                                                        }

                                                        // 2. Load selected language from store to buffer
                                                        const next =
                                                            updatedStore[lang]
                                                        setValues(
                                                            {
                                                                ...values,
                                                                localTranslations:
                                                                    updatedStore,
                                                                language: lang,
                                                                name:
                                                                    next?.name ??
                                                                    '',
                                                                description:
                                                                    next?.description ??
                                                                    '',
                                                            },
                                                            true, // skip validation during switch
                                                        )
                                                    }}
                                                />
                                            }
                                        />

                                        <div className="pt-3">
                                            <FormItem
                                                asterisk
                                                label={t('brands.name')}
                                                invalid={Boolean(
                                                    touched.name && errors.name,
                                                )}
                                                errorMessage={errors.name}
                                            >
                                                <Field
                                                    name="name"
                                                    component={Input}
                                                    placeholder={t(
                                                        'brands.nameAdd',
                                                    )}
                                                />
                                            </FormItem>

                                            <FormItem
                                                label={t(
                                                    'brands.description',
                                                )}
                                            >
                                                <Field name="description">
                                                    {({
                                                        field,
                                                    }: FieldProps) => (
                                                        <Input
                                                            {...field}
                                                            textArea
                                                            rows={4}
                                                            placeholder={t(
                                                                'brands.descriptionAdd',
                                                            )}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>

                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('brands.mediaAssets')}
                                            icon={<Icon name="assets" />}
                                        />
                                        <div className="space-y-3 py-3">
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                <span className="text-red-500 ltr:mr-1 rtl:ml-1 mx-2">
                                                    *
                                                </span>
                                                {t('brands.logo')}
                                            </label>
                                            <BrandLogoUpload />
                                        </div>
                                    </BackgroundRounded>
                                </div>

                                {/* Right Column - Publishing & Classification */}
                                <div className="lg:col-span-1 space-y-4">
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('brands.publishing')}
                                            icon={<Icon name="show" />}
                                        />

                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${values.status === "active" ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <label className="text-sm font-medium">
                                                    {t(
                                                        'brands.activeStatus',
                                                    )}
                                                </label>
                                            </div>
                                            <Field name="status">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps<string>) => (
                                                    <Switcher
                                                        checked={
                                                            field.value ===
                                                            'active'
                                                        }
                                                        onChange={(checked) => {
                                                            form.setFieldValue(
                                                                field.name,
                                                                checked
                                                                    ? 'active'
                                                                    : 'inactive',
                                                            )
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </div>

                                        <div className="py-3 mt-2">
                                            <FormItem
                                                asterisk
                                                label={t(
                                                    'brands.sortOrder',
                                                )}
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
                                                        'brands.sortOrderPlaceholder',
                                                    )}
                                                />
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>

                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t(
                                                'brands.classification',
                                            )}
                                            icon={
                                                <Icon name="classification" />
                                            }
                                        />

                                        <div className="py-3">
                                            <FormItem
                                                asterisk
                                                label={t('brands.category')}
                                                invalid={Boolean(
                                                    touched.categoryId &&
                                                    errors.categoryId,
                                                )}
                                                errorMessage={errors.categoryId as string}
                                            >
                                                <CategorySelect
                                                    size="sm"
                                                    placeholder={t(
                                                        'brands.selectCategory',
                                                    )}
                                                    value={values.categoryId}
                                                    menuPortalZ={400}
                                                    onChange={(opt) =>
                                                        setFieldValue(
                                                            'categoryId',
                                                            opt ?? null,
                                                        )
                                                    }
                                                />
                                            </FormItem>
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
                                    disabled={submitting || isLoading}
                                >
                                    {isUpdateMode
                                        ? t('brands.update.submit')
                                        : t('brands.create.submit')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormBrand
