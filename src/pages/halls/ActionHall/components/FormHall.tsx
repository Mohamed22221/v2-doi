import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps, Form, Formik } from 'formik'
import dayjs from 'dayjs'
import classNames from 'classnames'

// UI Components
import {
    Button,
    Input,
    Notification,
    toast,
    Radio,
    FormContainer,
    FormItem,
} from '@/components/ui'
import Icon from '@/components/ui/Icon/Icon'

// Shared & Helper Components
import FormHallSkeleton from './FormHallSkeleton'
import ErrorState from '@/components/shared/ErrorState'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import LanguageSelect from '@/components/helpers/LanguageSelect'
import CategorySelect from '@/components/helpers/CategoriesSelect'
import RegionsSelect from '@/components/helpers/RegionsSelect'
import HallImageUpload from './HallImageUpload'
import TimeSection from './TimeSection'

// Hooks & API
import { useGetHallById, useCreateHall, useUpdateHall } from '@/api/hooks/halls'
import { getApiErrorMessage } from '@/api/error'
import getHallValidationSchema from './schema'

// Types
import type { HallVisibilityStatus, MainHall, HallItemDetails } from '@/api/types/halls'
import { LanguageCode } from '@/api/types/common'

// --- Types & Constants ---

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

const DEFAULT_INITIAL_VALUES: FormValues = {
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

// --- Helper Functions ---

const transformToPayload = (values: FormValues): MainHall => {
    // 1. Prepare translations
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
            languageCode: languageCode.toUpperCase() as LanguageCode,
            name: v.name || '',
            description: v.description || '',
        }))

    // 2. Handle Date & Time
    let scheduledStartTime: string | undefined = undefined
    if (values.hallDate && values.startingTime) {
        const combined = dayjs(
            `${dayjs(values.hallDate).format('YYYY-MM-DD')}T${values.startingTime}:00`,
        )
        if (combined.isValid()) {
            scheduledStartTime = combined.toISOString()
        }
    }

    // 3. Durations
    const itemBiddingDurationSeconds = values.itemDuration
        ? Number(values.itemDuration) * 60
        : undefined

    const payload: MainHall = {
        translations,
        coverImage: values.coverImage || undefined,
        categoryIds: values.categorySelectionType === 'all' ? [] : values.categoryIds || [],
        regionId: values.regionId || '',
        visibilityStatus: values.visibilityStatus,
        extensionSeconds: 0,
    }

    if (itemBiddingDurationSeconds !== undefined && itemBiddingDurationSeconds >= 10) {
        payload.itemBiddingDurationSeconds = itemBiddingDurationSeconds
    }

    if (scheduledStartTime) {
        payload.scheduledStartTime = scheduledStartTime
    }

    return payload
}

const getInitialValues = (hall: HallItemDetails | undefined, currentLanguage: LanguageCode): FormValues => {
    if (!hall) return { ...DEFAULT_INITIAL_VALUES, language: currentLanguage }

    const translations =
        hall.translations?.reduce<Record<string, { name: string; description: string }>>(
            (acc, t) => {
                const lang = t.languageCode.toLowerCase()
                acc[lang] = { name: t.name, description: t.description || '' }
                return acc
            },
            {},
        ) || {}

    const currentTranslation = hall.translations?.find(
        (t) => t.languageCode.toLowerCase() === currentLanguage,
    )

    return {
        ...DEFAULT_INITIAL_VALUES,
        name: currentTranslation?.name || '',
        description: currentTranslation?.description || '',
        categorySelectionType: hall.categories && hall.categories.length > 0 ? 'specific' : 'all',
        categoryIds: hall.categories?.map((cat) => cat.id) || [],
        regionId: hall.regionId ?? null,
        coverImage: hall.coverImage ?? '',
        language: currentLanguage,
        localTranslations: translations,
        hallDate: hall.scheduledStartTime ? new Date(hall.scheduledStartTime) : null,
        startingTime: hall.scheduledStartTime ? dayjs(hall.scheduledStartTime).format('HH:mm') : '',
        itemDuration: hall.itemBiddingDurationSeconds ? hall.itemBiddingDurationSeconds / 60 : '',
        visibilityStatus: hall.visibilityStatus ?? 'DRAFT',
    }
}

// --- Sub-components ---

interface FormActionsProps {
    isUpdateMode: boolean
    submitting: boolean
    currentStatus: HallVisibilityStatus
    onCancel: () => void
    setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void
    submitForm: () => Promise<void>
}

const FormActions = ({
    isUpdateMode,
    submitting,
    currentStatus,
    onCancel,
    setFieldValue,
    submitForm,
}: FormActionsProps) => {
    const { t } = useTranslation()

    const handleAction = (status: HallVisibilityStatus) => {
        setFieldValue('visibilityStatus', status)
        setTimeout(() => submitForm(), 0)
    }

    return (
        <div className="mt-4 flex gap-3">
            <Button
                variant="solid"
                type="button"
                loading={submitting && currentStatus === 'ARCHIVED'}
                disabled={submitting}
                onClick={() => handleAction('ARCHIVED')}
            >
                {isUpdateMode ? t('halls.update.submit') : t('halls.create.submit')}
            </Button>
            <Button
                type="button"
                variant="plain"
                className="border-[2px] !border-primary-200 hover:border-primary-200"
                loading={submitting && currentStatus === 'DRAFT'}
                disabled={submitting}
                onClick={() => handleAction('DRAFT')}
            >
                {t('common.saveAsDraft')}
            </Button>
            <Button type="button" disabled={submitting} onClick={onCancel}>
                {t('common.cancelChanges')}
            </Button>
        </div>
    )
}

// --- Main Component ---

const FormHall = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdateMode = Boolean(id)
    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language as LanguageCode

    const { hall: hallDetails, isLoading, isError, error } = useGetHallById(id as string)
    const { mutateAsync: createHall, isPending: isCreating } = useCreateHall()
    const { mutateAsync: updateHall, isPending: isUpdating } = useUpdateHall()

    useEffect(() => {
        if (isUpdateMode && hallDetails && hallDetails.visibilityStatus !== 'DRAFT') {
            toast.push(<Notification title={t('halls.errors.onlyDraftEditable')} type="danger" />)
            navigate('/halls')
        }
    }, [isUpdateMode, hallDetails, navigate, t])

    const handleSubmit = async (values: FormValues, setSubmitting: (v: boolean) => void) => {
        try {
            const payload = transformToPayload(values)

            if (isUpdateMode && id) {
                await updateHall({ id, data: payload })
                toast.push(<Notification title={t('halls.update.success')} type="success" />)
            } else {
                await createHall(payload)
                toast.push(<Notification title={t('halls.create.success')} type="success" />)
            }
            navigate('/halls')
        } catch (error) {
            toast.push(<Notification title={getApiErrorMessage(error)} type="danger" />)
        } finally {
            setSubmitting(false)
        }
    }

    if (isUpdateMode && isLoading) return <FormHallSkeleton />
    if (isUpdateMode && isError) return <ErrorState message={error?.message} fullPage={true} />

    const optionClasses = (option: string, current: string, extra: string = '') =>
        classNames(
            'border rounded-xl p-4 transition-all cursor-pointer flex items-start gap-4',
            current === option
                ? 'border-primary-200 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/20'
                : 'border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700',
            extra,
        )

    return (
        <Formik
            enableReinitialize
            initialValues={getInitialValues(hallDetails, currentLanguage)}
            validationSchema={getHallValidationSchema(t)}
            onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
        >
            {({ touched, errors, isSubmitting, setFieldValue, setValues, values, submitForm }) => {
                const submitting = isSubmitting || isCreating || isUpdating

                const onLanguageChange = (lang: string | null) => {
                    if (!lang) return
                    const updatedStore = {
                        ...values.localTranslations,
                        [values.language]: { name: values.name, description: values.description },
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
                }

                return (
                    <Form>
                        <FormContainer>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <div className="lg:col-span-2 space-y-4">
                                    {/* General Information */}
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('halls.generalInformation')}
                                            icon={<Icon name="info" />}
                                            rightSlot={
                                                <LanguageSelect
                                                    value={values.language}
                                                    onChange={onLanguageChange}
                                                />
                                            }
                                        />
                                        <div className="pt-3">
                                            <FormItem
                                                asterisk
                                                label={t('halls.name')}
                                                invalid={!!(touched.name && errors.name)}
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
                                                invalid={!!(touched.regionId && errors.regionId)}
                                                errorMessage={errors.regionId}
                                            >
                                                <RegionsSelect
                                                    value={values.regionId}
                                                    onChange={(val) => setFieldValue('regionId', val)}
                                                    placeholder={t('locations.cities.modal.fields.regionPlaceholder')}
                                                    size="md"
                                                />
                                            </FormItem>

                                            <FormItem label={t('halls.description')}>
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

                                    {/* Media Assets */}
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('halls.mediaAssets')}
                                            icon={<Icon name="assets" />}
                                        />
                                        <div className="space-y-3 py-3">
                                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                <span className="text-red-500 ltr:mr-1 rtl:ml-1 mx-2">*</span>
                                                {t('halls.coverImage')} (4:3)
                                            </label>
                                            <HallImageUpload />
                                        </div>
                                    </BackgroundRounded>
                                </div>

                                <div className="lg:col-span-1 space-y-4">
                                    <TimeSection />

                                    {/* Classification */}
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('halls.classification')}
                                            icon={<Icon name="classification" />}
                                        />
                                        <div className="py-3">
                                            <Radio.Group
                                                vertical
                                                value={values.categorySelectionType}
                                                onChange={(val) => setFieldValue('categorySelectionType', val)}
                                                className="w-full space-y-4"
                                            >
                                                <div
                                                    className={optionClasses('all', values.categorySelectionType)}
                                                    onClick={() => setFieldValue('categorySelectionType', 'all')}
                                                >
                                                    <div className="flex gap-4 w-full">
                                                        <Radio value="all" />
                                                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                                                            {t('halls.categories.all')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div
                                                    className={optionClasses('specific', values.categorySelectionType, 'flex-col')}
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

                            <FormActions
                                submitting={submitting}
                                isUpdateMode={isUpdateMode}
                                currentStatus={values.visibilityStatus}
                                setFieldValue={setFieldValue}
                                submitForm={submitForm}
                                onCancel={() => navigate(-1)}
                            />
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormHall
