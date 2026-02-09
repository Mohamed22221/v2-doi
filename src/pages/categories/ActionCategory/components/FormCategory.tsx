import React, { useState, useEffect } from 'react'
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
    Radio,
    FormContainer,
    FormItem,
} from '@/components/ui'
import classNames from 'classnames'

// API hooks
import {
    useCreateCategory,
    useGetCategoryById,
    useUpdateCategory,
} from '@/api/hooks/categories'
import { getApiErrorMessage } from '@/api/error'

// Validation
import getCategoryValidationSchema from './schema'

// Components
import CategoryImageUpload from './CategoryImageUpload'
import FormCategorySkeleton from './FormCategorySkeleton'
import ErrorState from '@/components/shared/ErrorState'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import Icon from '@/components/ui/Icon/Icon'
import LanguageSelect from '@/components/helpers/LanguageSelect'
import CategorySelect from '@/components/helpers/CategoriesSelect'
import StatusSwitcher from '../../components/StatusSwitcher'
// Types
import type { CategoryPayload, LanguageCode } from '@/api/types/categories'

type FormValues = {
    name: string
    description: string
    parentId: string | null
    status: 'active' | 'inactive'
    image: string
    sortOrder: number
    language: string
    localTranslations: Record<string, { name: string; description: string }>

}

const FormCategory = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdateMode = Boolean(id)
    const { t } = useTranslation()

    const {
        data: categoryDetails,
        isLoading,
        isError,
        error,
    } = useGetCategoryById(id as string, {
        enabled: isUpdateMode,
    })

    const { mutateAsync: createCategory, isPending: isCreating } =
        useCreateCategory()
    const { mutateAsync: updateCategory, isPending: isUpdating } =
        useUpdateCategory()

    const [categoryType, setCategoryType] = useState<'main' | 'sub'>('main')

    const initialValues: FormValues = {
        name: '',
        description: '',
        parentId: null,
        status: 'active',
        image: '',
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
            const payload: CategoryPayload = {
                translations,
                parentId: values.parentId || null,
                status: values.status,
                sortOrder: Number(values.sortOrder),
                image: values.image || null,
            }

            if (isUpdateMode && id) {
                await updateCategory({ id, payload })
                toast.push(
                    <Notification
                        title={t('categories.update.success')}
                        type="success"
                    />,
                )
            } else {
                await createCategory(payload)
                toast.push(
                    <Notification
                        title={t('categories.create.success')}
                        type="success"
                    />,
                )
            }
            navigate('/categories')
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

    const getOptionClasses = (
        option: 'main' | 'sub',
        baseClassName: string = '',
    ) => {
        const isActive = categoryType === option

        return classNames(
            'border rounded-xl p-4 transition-all cursor-pointer flex items-start gap-4',
            isActive
                ? 'border-primary-200 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/20'
                : 'border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700',
            baseClassName,
        )
    }

    useEffect(() => {
        if (categoryDetails?.data?.parentId) {
            setCategoryType('sub')
        } else if (isUpdateMode && categoryDetails?.data?.parentId === null) {
            setCategoryType('main')
        }
    }, [categoryDetails?.data?.parentId, isUpdateMode])

    if (isLoading) return <FormCategorySkeleton />
    if (isError) return <ErrorState message={error?.message} fullPage />

    return (
        <Formik
            enableReinitialize
            initialValues={
                isUpdateMode && categoryDetails?.data
                    ? {
                        ...initialValues,
                        parentId: categoryDetails.data.parentId ?? null,
                        status: categoryDetails.data.status ?? 'active',
                        image: categoryDetails.data.image ?? '',
                        sortOrder: categoryDetails.data.sortOrder ?? 0,
                        localTranslations:
                            categoryDetails.data.translations?.reduce(
                                (acc: Record<string, { name: string; description: string }>, t) => {
                                    const lang = t.languageCode.toLowerCase()
                                    const entry = acc[lang] || { name: '', description: '' }

                                    if (t.name) entry.name = t.name
                                    if (t.description) entry.description = t.description

                                    return { ...acc, [lang]: entry }
                                },
                                {},
                            ) ?? {},
                        language:
                            categoryDetails.data.translations?.[0]
                                ?.languageCode || 'en',
                        name:
                            categoryDetails.data.translations?.find(
                                (t) =>

                                    t.languageCode.toLowerCase() ===
                                    (categoryDetails.data.translations?.[0]?.languageCode.toLowerCase() ||
                                        'en'),
                            )?.name || '',
                        description:
                            categoryDetails.data.translations?.find(
                                (t) => t.languageCode.toLowerCase() === (categoryDetails.data.translations?.[0]?.languageCode.toLowerCase() || 'en'),
                            )?.description || '',
                    }
                    : initialValues
            }
            validationSchema={getCategoryValidationSchema(t)}
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
                                                'categories.generalInformation',
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
                                                label={t('categories.name')}
                                                invalid={Boolean(
                                                    touched.name && errors.name,
                                                )}
                                                errorMessage={errors.name}
                                            >
                                                <Field
                                                    name="name"
                                                    component={Input}
                                                    placeholder={t(
                                                        'categories.nameAdd',
                                                    )}
                                                />
                                            </FormItem>

                                            <FormItem
                                                label={t(
                                                    'categories.description',
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
                                                                'categories.descriptionAdd',
                                                            )}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>

                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('categories.mediaAssets')}
                                            icon={<Icon name="assets" />}
                                        />
                                        <div className="space-y-3 py-3">
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                <span className="text-red-500 ltr:mr-1 rtl:ml-1 mx-2">
                                                    *
                                                </span>
                                                {t('categories.coverImage')}{' '}
                                                (16:9)
                                            </label>
                                            <CategoryImageUpload />
                                        </div>
                                    </BackgroundRounded>
                                </div>

                                {/* Right Column - Publishing & Classification */}
                                <div className="lg:col-span-1 space-y-4">
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('categories.publishing')}
                                            icon={<Icon name="show" />}
                                        />

                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${isUpdateMode ? (categoryDetails?.data?.status === "active" ? 'bg-green-500' : 'bg-red-500') : (values.status === "active" ? 'bg-green-500' : 'bg-red-500')}`}></span>
                                                <label className="text-sm font-medium">
                                                    {t(
                                                        'categories.activeStatus',
                                                    )}
                                                </label>
                                            </div>
                                            {isUpdateMode && categoryDetails?.data ? (
                                                <StatusSwitcher row={categoryDetails.data as any} />
                                            ) : (
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
                                            )}
                                        </div>

                                        <div className="py-3 mt-2">
                                            <FormItem
                                                asterisk
                                                label={t(
                                                    'categories.sortOrder',
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
                                                        'categories.sortOrderPlaceholder',
                                                    )}
                                                />
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>

                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t(
                                                'categories.classification',
                                            )}
                                            icon={
                                                <Icon name="classification" />
                                            }
                                        />

                                        <div className="py-3">
                                            <Radio.Group
                                                vertical
                                                value={categoryType}
                                                onChange={(val) => {
                                                    setCategoryType(val)
                                                    if (val === 'main') {
                                                        setFieldValue(
                                                            'parentId',
                                                            null,
                                                        )
                                                    }
                                                }}
                                                className="w-full space-y-4"
                                            >
                                                <div
                                                    className={getOptionClasses(
                                                        'main',
                                                    )}
                                                    onClick={() => {
                                                        setCategoryType('main')
                                                        setFieldValue(
                                                            'parentId',
                                                            null,
                                                        )
                                                    }}
                                                >
                                                    <div className="flex gap-4 w-full">
                                                        <Radio value="main" />

                                                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                                                            {t(
                                                                'categories.parentCategory',
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div
                                                    className={getOptionClasses(
                                                        'sub',
                                                        'flex-col',
                                                    )}
                                                    onClick={() =>
                                                        setCategoryType('sub')
                                                    }
                                                >
                                                    <div className="flex  gap-4 w-full">
                                                        <Radio value="sub" />

                                                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm block mb-1">
                                                            {t(
                                                                'categories.subCategory',
                                                            )}
                                                        </span>
                                                    </div>

                                                    {categoryType === 'sub' && (
                                                        <div
                                                            className="w-full mt-1 pt-2 border-t border-dashed border-neutral-100 dark:border-neutral-700"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <label className="block text-[11px] font-bold text-primary-500 dark:text-primary-100 uppercase tracking-wider mb-2">
                                                                {t(
                                                                    'categories.selectParent',
                                                                )}
                                                            </label>
                                                            <CategorySelect
                                                                size="sm"
                                                                placeholder={t(
                                                                    'categories.selectParent',
                                                                )}
                                                                value={
                                                                    values.parentId
                                                                }
                                                                initialOption={
                                                                    categoryDetails
                                                                        ?.data?.parent
                                                                }
                                                                // level={
                                                                //     categoryDetails?.data?.level
                                                                //         ? categoryDetails.data.level
                                                                //         : undefined
                                                                // }
                                                                menuPortalZ={
                                                                    400
                                                                }
                                                                onChange={(
                                                                    opt,
                                                                ) =>
                                                                    setFieldValue(
                                                                        'parentId',
                                                                        opt ??
                                                                        null,
                                                                    )
                                                                }
                                                            />
                                                            {touched.parentId &&
                                                                errors.parentId && (
                                                                    <div className="text-xs text-red-500 mt-1">
                                                                        {
                                                                            errors.parentId as string
                                                                        }
                                                                    </div>
                                                                )}
                                                        </div>
                                                    )}
                                                </div>
                                            </Radio.Group>
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
                                        ? t('categories.update.submit')
                                        : t('categories.create.submit')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormCategory
