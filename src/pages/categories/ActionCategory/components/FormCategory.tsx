import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps, Form, Formik } from 'formik'

// UI
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
// import Card from '@/components/ui/Card'
import {
    Notification,
    Select,
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
    useGetAllCategoriesSelect,
} from '@/api/hooks/categories'
import { getApiErrorMessage } from '@/api/error'

// Validation
import getCategoryValidationSchema from './schema'

// Components
import CategoryImageUpload from './CategoryImageUpload'
import FormCategorySkeleton from './FormCategorySkeleton'
import ErrorState from '@/components/shared/ErrorState'

// Types
import type {
    Category,
    CategoryPayload,
    
} from '@/api/types/categories'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import Icon from '@/components/ui/Icon/Icon'

type FormValues = {
    nameEn: string
    nameAr: string
    descriptionEn: string
    descriptionAr: string
    parentId: string | null
    status: 'active' | 'inactive'
    image: string
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

    const {
        data: categoriesData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading: isLoadingCategoriesList,
    } = useGetAllCategoriesSelect()

    const categoryOptions =
        categoriesData?.items?.map((cat: Category) => {
           const name =
                cat.translations.find((t) => t.languageCode === 'en')?.value ||
                cat.translations.find((t) => t.languageCode === 'ar')?.value ||
                cat.slug
            return {
                label: name,
                value: cat.id,
            }
        }) ?? []

    const [categoryType, setCategoryType] = useState<'main' | 'sub'>('main')

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

    const initialValues: FormValues = {
        nameEn: '',
        nameAr: '',
        descriptionEn: '',
        descriptionAr: '',
        parentId: null,
        status: 'active',
        image: '',
    }

    const handleSubmit = async (
        values: FormValues,
        setSubmitting: (v: boolean) => void,
    ) => {
        try {
            // Transform form values to API payload format
            const payload: CategoryPayload = {
                translations: [
                    {
                        languageCode: 'en',
                        value: values.nameEn,
                        description: values.descriptionEn || '',
                    },
                    {
                        languageCode: 'ar',
                        value: values.nameAr,
                        description: values.descriptionAr || '',
                    },
                ],
                parentId: values.parentId || null,
                status: values.status,
                sortOrder: 0,
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
    useEffect(() => {
        if (categoryDetails?.data.parentId) {
            setCategoryType('sub')
        } else if (isUpdateMode && categoryDetails?.data?.parentId === null) {
            setCategoryType('main')
        }
    }, [categoryDetails?.data.parentId, isUpdateMode, categoryDetails])

    if (isLoading) {
        return <FormCategorySkeleton />
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
                isUpdateMode && categoryDetails?.data
                    ? {
                          nameEn:
                              categoryDetails.data.translations?.find(
                                  (t) => t.languageCode === 'en',
                              )?.value ?? '',
                          nameAr:
                              categoryDetails.data.translations?.find(
                                  (t) => t.languageCode === 'ar',
                              )?.value ?? '',
                          descriptionEn:
                              categoryDetails.data.translations?.find(
                                  (t) => t.languageCode === 'en',
                              )?.description ?? '',
                          descriptionAr:
                              categoryDetails.data.translations?.find(
                                  (t) => t.languageCode === 'ar',
                              )?.description ?? '',
                          parentId: categoryDetails.data.parentId ?? null,
                          status: categoryDetails.data.status ?? 'active',
                          image: categoryDetails.data.image ?? '',
                      }
                    : initialValues
            }
            validationSchema={getCategoryValidationSchema(t)}
            onSubmit={(values, { setSubmitting }) =>
                handleSubmit(values, setSubmitting)
            }
        >
            {({ touched, errors, isSubmitting, setFieldValue, values }) => {
                const submitting = isSubmitting || isCreating || isUpdating

                // Initialize categoryType based on values.parentId

                return (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Left Column - General Information & Media Assets */}
                                <div className="lg:col-span-2 space-y-4">
                                    {/* General Information Card */}
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t(
                                                'categories.generalInformation',
                                            )}
                                            icon={<Icon name="info" />}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3">
                                            <FormItem
                                                asterisk
                                                label={t('categories.nameEn')}
                                                invalid={Boolean(
                                                    touched.nameEn &&
                                                        errors.nameEn,
                                                )}
                                                errorMessage={errors.nameEn}
                                            >
                                                <Field
                                                    name="nameEn"
                                                    component={Input}
                                                    placeholder={t(
                                                        'categories.nameEnAdd',
                                                    )}
                                                />
                                            </FormItem>
                                            <FormItem
                                                asterisk
                                                label={t('categories.nameAr')}
                                                invalid={Boolean(
                                                    touched.nameAr &&
                                                        errors.nameAr,
                                                )}
                                                errorMessage={errors.nameAr}
                                            >
                                                <Field
                                                    name="nameAr"
                                                    component={Input}
                                                    placeholder={t(
                                                        'categories.nameArAdd',
                                                    )}
                                                />
                                            </FormItem>
                                        </div>

                                        {/* Category Description - Side by side */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                            <FormItem
                                                label={t(
                                                    'categories.descriptionEn',
                                                )}
                                            >
                                                <Field name="descriptionEn">
                                                    {({
                                                        field,
                                                    }: FieldProps) => (
                                                        <Input
                                                            {...field}
                                                            textArea
                                                            rows={4}
                                                            placeholder={t(
                                                                'categories.descriptionEnAdd',
                                                            )}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>

                                            <FormItem
                                                label={t(
                                                    'categories.descriptionAr',
                                                )}
                                            >
                                                <Field name="descriptionAr">
                                                    {({
                                                        field,
                                                    }: FieldProps) => (
                                                        <Input
                                                            {...field}
                                                            textArea
                                                            rows={4}
                                                            placeholder={t(
                                                                'categories.descriptionArAdd',
                                                            )}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>

                                    {/* Media Assets Card */}
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
                                    {/* Publishing Card */}
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('categories.publishing')}
                                            icon={<Icon name="show" />}
                                        />

                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                                <label className="text-sm font-medium">
                                                    {t(
                                                        'categories.activeStatus',
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
                                    </BackgroundRounded>

                                    {/* Classification Card */}
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t(
                                                'categories.classification',
                                            )}
                                            icon={
                                                <Icon name="classification" />
                                            }
                                        />

                                        <div className="space-y-4 py-3">
                                            <div>
                                                <Radio.Group
                                                    vertical
                                                    value={categoryType}
                                                    onChange={(val) => {
                                                        const newType = val as
                                                            | 'main'
                                                            | 'sub'
                                                        setCategoryType(newType)
                                                        if (
                                                            newType === 'main'
                                                        ) {
                                                            const isOriginallyMain =
                                                                categoryDetails
                                                                    ?.data
                                                                    ?.parentId ===
                                                                    null ||
                                                                categoryDetails
                                                                    ?.data
                                                                    ?.level ===
                                                                    1
                                                            if (
                                                                isUpdateMode &&
                                                                isOriginallyMain
                                                            ) {
                                                                setFieldValue(
                                                                    'parentId',
                                                                    categoryDetails
                                                                        ?.data
                                                                        ?.parentId,
                                                                )
                                                            } else {
                                                                setFieldValue(
                                                                    'parentId',
                                                                    null,
                                                                )
                                                            }
                                                        }
                                                    }}
                                                    className="w-full space-y-4"
                                                >
                                                    <div
                                                        className={getOptionClasses(
                                                            'main',
                                                        )}
                                                        onClick={() => {
                                                            setCategoryType(
                                                                'main',
                                                            )
                                                            const isOriginallyMain =
                                                                categoryDetails
                                                                    ?.data
                                                                    ?.parentId ===
                                                                    null ||
                                                                categoryDetails
                                                                    ?.data
                                                                    ?.level ===
                                                                    1
                                                            if (
                                                                isUpdateMode &&
                                                                isOriginallyMain
                                                            ) {
                                                                setFieldValue(
                                                                    'parentId',
                                                                    categoryDetails
                                                                        ?.data
                                                                        ?.parentId,
                                                                )
                                                            } else {
                                                                setFieldValue(
                                                                    'parentId',
                                                                    null,
                                                                )
                                                            }
                                                        }}
                                                    >
                                                        <Radio
                                                            value="main"
                                                            className="mt-1"
                                                        />
                                                        <div className="flex-1 text-left">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                                                                    {t(
                                                                        'categories.parentCategory',
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={getOptionClasses(
                                                            'sub',
                                                            'flex-col',
                                                        )}
                                                        onClick={() =>
                                                            setCategoryType(
                                                                'sub',
                                                            )
                                                        }
                                                    >
                                                        <div className="flex items-start gap-4 w-full">
                                                            <Radio
                                                                value="sub"
                                                                className="mt-1"
                                                            />
                                                            <div className="flex-1 text-start">
                                                                <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm block mb-1">
                                                                    {t(
                                                                        'categories.subCategory',
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {categoryType ===
                                                            'sub' && (
                                                            <div
                                                                className="w-full mt-4 pt-4 border-t border-dashed border-neutral-100 dark:border-neutral-700"
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
                                                            >
                                                                <label className="block text-[11px] font-bold text-primary-500 dark:text-primary-100 uppercase tracking-wider mb-2">
                                                                    {t(
                                                                        'categories.selectParent',
                                                                    )}
                                                                </label>
                                                                <Select
                                                                    size="sm"
                                                                    maxMenuHeight={
                                                                        300
                                                                    }
                                                                    placeholder={t(
                                                                        'categories.selectParent',
                                                                    )}
                                                                    options={
                                                                        categoryOptions
                                                                    }
                                                                    value={categoryOptions.find(
                                                                        (opt) =>
                                                                            opt.value ===
                                                                            values.parentId,
                                                                    )}
                                                                    hasMore={
                                                                        hasNextPage
                                                                    }
                                                                    isLoadingMore={
                                                                        isFetchingNextPage
                                                                    }
                                                                    onLoadMore={() =>
                                                                        fetchNextPage()
                                                                    }
                                                                    onChange={(
                                                                        opt,
                                                                    ) =>
                                                                        setFieldValue(
                                                                            'parentId',
                                                                            opt?.value ??
                                                                                null,
                                                                        )
                                                                    }
                                                                    isLoading={
                                                                        isLoadingCategoriesList
                                                                    }
                                                                    loadMoreLabel={t("viewTable.filters.loadMore")}
                                                                />
                                                                {touched.parentId &&
                                                                    errors.parentId && (
                                                                        <div className="text-xs text-red-500 mt-1">
                                                                            {
                                                                                errors.parentId
                                                                            }
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </Radio.Group>
                                            </div>
                                        </div>
                                    </BackgroundRounded>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <Button
                                    type="button"
                                    variant="default"
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

                            {/* Action Buttons */}
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormCategory
