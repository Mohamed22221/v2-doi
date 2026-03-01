import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps, Form, Formik } from 'formik'
import dayjs from 'dayjs'

// UI
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import {
    Notification,
    toast,
    Radio,
    FormContainer,
    FormItem,
} from '@/components/ui'
import classNames from 'classnames'

// Validation
import getHallValidationSchema from './schema'

// Components
import HallImageUpload from './HallImageUpload'
import FormHallSkeleton from './FormHallSkeleton'
import ErrorState from '@/components/shared/ErrorState'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import Icon from '@/components/ui/Icon/Icon'
import LanguageSelect from '@/components/helpers/LanguageSelect'
import CategorySelect from '@/components/helpers/CategoriesSelect'
import RegionsSelect from '@/components/helpers/RegionsSelect'
import TimeSection from './TimeSection'

// API hooks
import {
    useGetHallById,
    useCreateHall,
    useUpdateHall,
} from '@/api/hooks/halls'
import { getApiErrorMessage } from '@/api/error'

// Types
import type { HallVisibilityStatus } from '@/api/types/halls'

type FormValues = {
    name: string
    description: string
    categorySelectionType: 'all' | 'specific'
    categoryIds: string[]
    regionId: string | null
    coverImage: string
    language: string
    localTranslations: Record<string, { name: string; description: string }>
    hallDate: Date | null
    startingTime: string
    itemDuration: number | string
    extensionMinutes: number | string
    visibilityStatus: HallVisibilityStatus
}

const FormHall = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdateMode = Boolean(id)
    const { t } = useTranslation()

    // Fetch hall details for edit mode
    const {
        hall: hallDetails,
        isLoading,
        isError,
        error,
    } = useGetHallById(id as string)

    const { mutateAsync: createHall, isPending: isCreating } = useCreateHall()
    const { mutateAsync: updateHall, isPending: isUpdating } = useUpdateHall()

    const [hallType, setHallType] = useState<'main' | 'sub'>('main')

    const initialValues: FormValues = {
        name: '',
        description: '',
        categorySelectionType: 'all',
        categoryIds: [],
        regionId: null,
        coverImage: '',
        language: 'en',
        localTranslations: {},
        hallDate: null,
        startingTime: '',
        itemDuration: '',
        extensionMinutes: 0,
        visibilityStatus: 'DRAFT',
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

            // Transform buffer into translations array
            const translations = Object.entries(finalStore)
                .filter(([, v]) => v.name?.trim() || v.description?.trim())
                .map(([languageCode, v]) => ({
                    languageCode: languageCode.toUpperCase() as any,
                    name: v.name || '',
                    description: v.description || '',
                }))

            // Merge Date and Time into ISO string
            let scheduledStartTime: string | undefined = undefined
            if (values.hallDate && values.startingTime) {
                const combined = dayjs(`${dayjs(values.hallDate).format('YYYY-MM-DD')}T${values.startingTime}:00`)
                if (combined.isValid()) {
                    scheduledStartTime = combined.toISOString()
                }
            }

            const itemBiddingDurationSeconds = values.itemDuration ? Number(values.itemDuration) * 60 : undefined
            const extensionSeconds = values.extensionMinutes ? Number(values.extensionMinutes) * 60 : 0

            const payload: any = {
                translations,
                coverImage: values.coverImage || undefined,
                categoryId: values.categoryIds?.[0] || undefined,
                regionId: values.regionId || undefined,
                visibilityStatus: values.visibilityStatus,
                extensionSeconds,
            }

            // Only add these if they meet backend requirements
            if (itemBiddingDurationSeconds !== undefined && itemBiddingDurationSeconds >= 10) {
                payload.itemBiddingDurationSeconds = itemBiddingDurationSeconds
            }

            if (scheduledStartTime) {
                payload.scheduledStartTime = scheduledStartTime
            }

            if (isUpdateMode && id) {
                await updateHall({ id, data: payload })
                toast.push(
                    <Notification
                        title={t('halls.update.success')}
                        type="success"
                    />,
                )
            } else {
                await createHall(payload)
                toast.push(
                    <Notification
                        title={t('halls.create.success')}
                        type="success"
                    />,
                )
            }
            navigate('/halls')
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
        option: string,
        currentValue: string,
        baseClassName: string = '',
    ) => {
        const isActive = currentValue === option

        return classNames(
            'border rounded-xl p-4 transition-all cursor-pointer flex items-start gap-4',
            isActive
                ? 'border-primary-200 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/20'
                : 'border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700',
            baseClassName,
        )
    }



    useEffect(() => {
        if (isUpdateMode && hallDetails) {
            // parentId-based hall type detection
            // (no parentId field on API yet, so default to main)
            setHallType('main')
        }
    }, [hallDetails, isUpdateMode])

    useEffect(() => {
        if (isUpdateMode && hallDetails && hallDetails.visibilityStatus !== 'DRAFT') {
            toast.push(
                <Notification
                    title={t('halls.errors.onlyDraftEditable')}
                    type="danger"
                />,
            )
            navigate('/halls')
        }
    }, [isUpdateMode, hallDetails, navigate, t])


    if (isUpdateMode && isLoading) return <FormHallSkeleton />
    if (isUpdateMode && isError) return <ErrorState message={(error as any)?.message} fullPage={true} />


    return (
        <Formik
            enableReinitialize
            initialValues={
                (isUpdateMode && hallDetails
                    ? {
                        ...initialValues,
                        categorySelectionType: hallDetails.categoryId ? 'specific' : 'all' as 'all' | 'specific',
                        categoryIds: hallDetails.categoryId ? [hallDetails.categoryId] : [],
                        regionId: hallDetails.regionId ?? null,
                        coverImage: hallDetails.coverImage ?? '',
                        localTranslations:
                            hallDetails.translations?.reduce(
                                (acc: Record<string, { name: string; description: string }>, t) => {
                                    const lang = t.languageCode.toLowerCase()
                                    acc[lang] = {
                                        name: t.name,
                                        description: t.description || '',
                                    }
                                    return acc
                                },
                                {},
                            ) ?? {},
                        language: 'en',
                        name: hallDetails.translations?.find(t => t.languageCode.toLowerCase() === 'en')?.name || '',
                        description: hallDetails.translations?.find(t => t.languageCode.toLowerCase() === 'en')?.description || '',
                        hallDate: hallDetails.scheduledStartTime ? new Date(hallDetails.scheduledStartTime) : null,
                        startingTime: hallDetails.scheduledStartTime ? dayjs(hallDetails.scheduledStartTime).format('HH:mm') : '',
                        itemDuration: hallDetails.itemBiddingDurationSeconds ? hallDetails.itemBiddingDurationSeconds / 60 : '',
                        extensionMinutes: 0,
                        visibilityStatus: hallDetails.visibilityStatus ?? 'DRAFT',
                    }
                    : initialValues) as FormValues
            }
            validationSchema={getHallValidationSchema(t)}
            onSubmit={(values, { setSubmitting }) => {
                console.log(values)
                handleSubmit(values, setSubmitting)

            }
            }
        >
            {({
                touched,
                errors,
                isSubmitting,
                setFieldValue,
                setValues,
                values,
                submitForm,
            }) => {
                const submitting = isSubmitting || isCreating || isUpdating

                const initialCategoryOptions = React.useMemo(() =>
                    hallDetails?.category ? [hallDetails.category] : [],
                    [hallDetails?.category]
                )

                return (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {/* Left Column - General Information & Media Assets (lg:col-span-2) */}
                                <div className="lg:col-span-2 space-y-4">
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('halls.generalInformation')}
                                            icon={<Icon name="info" />}
                                            rightSlot={
                                                <LanguageSelect
                                                    value={values.language}
                                                    onChange={(lang) => {
                                                        if (!lang) return

                                                        const updatedStore: Record<string, { name: string; description: string }> = {
                                                            ...values.localTranslations,
                                                            [values.language]: {
                                                                name: values.name,
                                                                description: values.description,
                                                            },
                                                        }

                                                        const next = updatedStore[lang]
                                                        setValues(
                                                            {
                                                                ...values,
                                                                localTranslations: updatedStore,
                                                                language: lang,
                                                                name: next?.name ?? '',
                                                                description: next?.description ?? '',
                                                            },
                                                            true,
                                                        )
                                                    }}
                                                />
                                            }
                                        />

                                        <div className="pt-3">
                                            <FormItem
                                                asterisk
                                                label={t('halls.name')}
                                                invalid={Boolean(touched.name && errors.name)}
                                                errorMessage={errors.name}
                                            >
                                                <Field
                                                    name="name"
                                                    component={Input}
                                                    placeholder={t('halls.namePlaceholder')}
                                                />
                                            </FormItem>

                                            <FormItem
                                                asterisk
                                                label={t('locations.cities.modal.fields.regionLabel')}
                                                invalid={Boolean(touched.regionId && errors.regionId)}
                                                errorMessage={errors.regionId}
                                            >
                                                <RegionsSelect
                                                    value={values.regionId}
                                                    onChange={(val) => setFieldValue('regionId', val)}
                                                    placeholder={t('locations.cities.modal.fields.regionPlaceholder')}
                                                    size='md'
                                                />
                                            </FormItem>

                                            <FormItem
                                                label={t('halls.description')}
                                            >
                                                <Field name="description">
                                                    {({ field }: FieldProps) => (
                                                        <Input
                                                            {...field}
                                                            textArea
                                                            rows={4}
                                                            placeholder={t('halls.descriptionPlaceholder')}
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>

                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('halls.mediaAssets')}
                                            icon={<Icon name="assets" />}
                                        />
                                        <div className="space-y-3 py-3">
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                <span className="text-red-500 ltr:mr-1 rtl:ml-1 mx-2">
                                                    *
                                                </span>
                                                {t('halls.coverImage')} (4:3)
                                            </label>
                                            <HallImageUpload />

                                        </div>
                                    </BackgroundRounded>

                                    {/* <TimeSection /> */}
                                </div>

                                {/* Right Column - Publishing & Classification (lg:col-span-1) */}
                                <div className="lg:col-span-1 space-y-4">
                                    <TimeSection />
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('halls.classification')}
                                            icon={<Icon name="classification" />}
                                        />

                                        <div className="py-3">
                                            <Radio.Group
                                                vertical
                                                value={values.categorySelectionType}
                                                onChange={(val) => {
                                                    setFieldValue('categorySelectionType', val)
                                                }}
                                                className="w-full space-y-4"
                                            >
                                                <div
                                                    className={getOptionClasses('all', values.categorySelectionType)}
                                                    onClick={() => {
                                                        setFieldValue('categorySelectionType', 'all')
                                                    }}
                                                >
                                                    <div className="flex gap-4 w-full">
                                                        <Radio value="all" />
                                                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                                                            {t('halls.categories.all')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div
                                                    className={getOptionClasses('specific', values.categorySelectionType, 'flex-col')}
                                                    onClick={() => setFieldValue('categorySelectionType', 'specific')}
                                                >
                                                    <div className="flex gap-4 w-full">
                                                        <Radio value="specific" />
                                                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm block mb-1">
                                                            {t('halls.categories.specific')}
                                                        </span>
                                                    </div>

                                                    {values.categorySelectionType === 'specific' && (
                                                        <div
                                                            className="w-full mt-1 pt-2 border-t border-dashed border-neutral-100 dark:border-neutral-700"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <label className="block text-[11px] font-bold text-primary-500 dark:text-primary-100 uppercase tracking-wider mb-2">
                                                                {t('halls.selectCategory')}
                                                            </label>
                                                            <CategorySelect
                                                                isMulti
                                                                level={3}
                                                                size="sm"
                                                                placeholder={t('halls.selectCategory')}
                                                                value={values.categoryIds}
                                                                initialId={values.categoryIds}
                                                                initialOption={initialCategoryOptions}
                                                                menuPortalZ={400}
                                                                onChange={(opt) => setFieldValue('categoryIds', opt ?? [])}
                                                            />
                                                            {touched.categoryIds && errors.categoryIds && (
                                                                <div className="text-xs text-red-500 mt-1">
                                                                    {errors.categoryIds as string}
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
                                    variant="solid"
                                    type="button"
                                    loading={submitting}
                                    disabled={submitting}
                                    onClick={() => {
                                        setFieldValue('visibilityStatus', 'ARCHIVED')
                                        setTimeout(() => submitForm(), 0)
                                    }}
                                >
                                    {isUpdateMode
                                        ? t('halls.update.submit')
                                        : t('halls.create.submit')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="plain"
                                    className="border-[2px] !border-primary-200 hover:border-primary-200 bg-"
                                    loading={submitting}
                                    disabled={submitting}
                                    onClick={() => {
                                        setFieldValue('visibilityStatus', 'DRAFT')
                                        setTimeout(() => submitForm(), 0)
                                    }}
                                >
                                    {t('common.saveAsDraft')}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    disabled={submitting}
                                >
                                    {t('common.cancelChanges')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form >
                )
            }}
        </Formik >
    )
}

export default FormHall
