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
    // Select,
    toast,
    Radio,
    FormContainer,
    FormItem,
} from '@/components/ui'
import {} from // HiOutlineInformationCircle,
// HiOutlineDocumentText,
// HiOutlinePhotograph,
'react-icons/hi'

// API hooks
import {
    useCreateCategory,
    useGetCategoryById,
    useUpdateCategory,
    // useGetCategoriesTree,
} from '@/api/hooks/categories'
import { getApiErrorMessage } from '@/api/error'

// Validation
import getCategoryValidationSchema from './schema'

// Components
import CategoryImageUpload from './CategoryImageUpload'
import FormCategorySkeleton from './FormCategorySkeleton'
import ErrorState from '@/components/shared/ErrorState'

// Types
import type { CategoryPayload } from '@/api/types/categories'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import Icon from '@/components/ui/Icon/Icon'

// type CategoryOption = {
//     label: string
//     value: string
// }

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

    // const { data: treeData, isLoading: isLoadingTree } = useGetCategoriesTree()

    // Build category options from tree (flatten for dropdown)
    // const categoryOptions: CategoryOption[] = []
    // const flattenTree = (
    //     nodes: typeof treeData,
    //     prefix = '',
    // ): CategoryOption[] => {
    //     if (!nodes) return []
    //     const options: CategoryOption[] = []
    //     nodes.forEach((node) => {
    //         const enTranslation = node.translations?.find(
    //             (t) => t.languageCode === 'en',
    //         )
    //         const label = enTranslation?.name || node.slug
    //         options.push({
    //             label: prefix + label,
    //             value: node.id,
    //         })
    //         if (node.children && node.children.length > 0) {
    //             options.push(...flattenTree(node.children, prefix + '  '))
    //         }
    //     })
    //     return options
    // }
    // if (treeData) {
    //     categoryOptions.push(...flattenTree(treeData))
    // }

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
                        name: values.nameEn,
                        description: values.descriptionEn || "",
                    },
                    {
                        languageCode: 'ar',
                        name: values.nameAr,
                        description: values.descriptionAr || "",
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
                              )?.name ?? '',
                          nameAr:
                              categoryDetails.data.translations?.find(
                                  (t) => t.languageCode === 'ar',
                              )?.name ?? '',
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
            {({ touched, errors, isSubmitting }) => {
                const submitting = isSubmitting || isCreating || isUpdating
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
                                                <Field name="parentId">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps<
                                                        string | null
                                                    >) => (
                                                        <Radio.Group
                                                            value={
                                                                field.value
                                                                    ? 'sub'
                                                                    : 'parent'
                                                            }
                                                            onChange={(val) => {
                                                                if (
                                                                    val ===
                                                                    'parent'
                                                                ) {
                                                                    form.setFieldValue(
                                                                        field.name,
                                                                        null,
                                                                    )
                                                                }
                                                            }}
                                                        >
                                                            <Radio
                                                                value="parent"
                                                                className="mb-3"
                                                            >
                                                                {t(
                                                                    'categories.parentCategory',
                                                                )}
                                                            </Radio>
                                                            <Radio
                                                                value="sub"
                                                                className="mb-3"
                                                            >
                                                                {t(
                                                                    'categories.subCategory',
                                                                )}
                                                            </Radio>
                                                        </Radio.Group>
                                                    )}
                                                </Field>
                                            </div>

                                            {/* {values.parentId !== null && (
                                                <div>
                                                    <Field name="parentId">
                                                        {({
                                                            field,
                                                            form,
                                                        }: FieldProps<
                                                            string | null
                                                        >) => {
                                                            const selected =
                                                                categoryOptions.find(
                                                                    (o) =>
                                                                        o.value ===
                                                                        field.value,
                                                                ) ?? null

                                                            return (
                                                                <Select<CategoryOption>
                                                                    size="sm"
                                                                    isSearchable={
                                                                        true
                                                                    }
                                                                    placeholder={t(
                                                                        'categories.selectParent',
                                                                    )}
                                                                    value={
                                                                        selected
                                                                    }
                                                                    options={
                                                                        categoryOptions
                                                                    }
                                                                    isClearable={
                                                                        false
                                                                    }
                                                                    isLoading={
                                                                        isLoadingTree
                                                                    }
                                                                    onChange={(
                                                                        option,
                                                                    ) =>
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            option?.value ??
                                                                                null,
                                                                        )
                                                                    }
                                                                />
                                                            )
                                                        }}
                                                    </Field>
                                                    {touched.parentId &&
                                                        errors.parentId && (
                                                            <div className="text-xs text-red-500 mt-1">
                                                                {
                                                                    errors.parentId
                                                                }
                                                            </div>
                                                        )}
                                                </div>
                                            )} */}
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
