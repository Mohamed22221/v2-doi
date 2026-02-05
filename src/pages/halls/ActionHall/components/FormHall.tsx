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

// Validation
import getHallValidationSchema from './schema'

// Components
import HallImageUpload from './HallImageUpload'
import FormHallSkeleton from './FormHallSkeleton'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'
import Icon from '@/components/ui/Icon/Icon'
import LanguageSelect from '@/components/helpers/LanguageSelect'
import CategorySelect from '@/components/helpers/CategoriesSelect'

// Types
import type { HallStatus, HallItem, HallTranslation } from '@/api/types/halls'
import { LanguageCode } from '@/api/types/common'

// Mock Data
import { HALLS_ITEMS_MOCK } from '../../data/halls.mock'

type FormValues = {
    name: string
    description: string
    parentId: string | null
    status: HallStatus
    image: string
    sortOrder: number
    language: string
    localTranslations: Record<string, { name: string; description: string }>
}

const FormHall = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdateMode = Boolean(id)
    const { t } = useTranslation()

    // Simulate fetching details
    const hallDetails = isUpdateMode
        ? HALLS_ITEMS_MOCK.find(h => h.id === id)
        : null

    const [hallType, setHallType] = useState<'main' | 'sub'>('main')

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
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000))

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

            if (isUpdateMode && id) {
                const index = HALLS_ITEMS_MOCK.findIndex(h => h.id === id)
                if (index !== -1) {
                    HALLS_ITEMS_MOCK[index] = {
                        ...HALLS_ITEMS_MOCK[index],
                        name: values.name,
                        status: values.status,
                        parentId: values.parentId,
                        sortOrder: Number(values.sortOrder),
                        image: values.image || null,
                        translations: translations as HallTranslation[]
                    }
                }
                toast.push(
                    <Notification
                        title={t('halls.update.success')}
                        type="success"
                    />,
                )
            } else {
                const newHall: HallItem = {
                    id: (HALLS_ITEMS_MOCK.length + 1).toString(),
                    name: values.name,
                    code: `HALL-${Math.floor(Math.random() * 1000)}`, // Logic still needs a code but UI is clean
                    status: values.status,
                    assignedCount: 0,
                    createdAt: new Date().toISOString(),
                    parentId: values.parentId,
                    sortOrder: Number(values.sortOrder),
                    image: values.image || null,
                    translations: translations as HallTranslation[]
                }
                HALLS_ITEMS_MOCK.unshift(newHall)
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
                    title={t('common.error')}
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
        const isActive = hallType === option

        return classNames(
            'border rounded-xl p-4 transition-all cursor-pointer flex items-start gap-4',
            isActive
                ? 'border-primary-200 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/20'
                : 'border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700',
            baseClassName,
        )
    }

    useEffect(() => {
        if (hallDetails?.parentId) {
            setHallType('sub')
        } else if (isUpdateMode && hallDetails?.parentId === null) {
            setHallType('main')
        }
    }, [hallDetails?.parentId, isUpdateMode])

    return (
        <Formik
            enableReinitialize
            initialValues={
                isUpdateMode && hallDetails
                    ? {
                        ...initialValues,
                        parentId: hallDetails.parentId ?? null,
                        status: hallDetails.status ?? 'active',
                        image: hallDetails.image ?? '',
                        sortOrder: hallDetails.sortOrder ?? 0,
                        localTranslations:
                            hallDetails.translations?.reduce(
                                (acc: Record<string, { name: string; description: string }>, trans) => {
                                    const lang = trans.languageCode.toLowerCase()
                                    const entry = acc[lang] || { name: '', description: '' }
                                    if (trans.name) entry.name = trans.name
                                    if (trans.description) entry.description = trans.description
                                    return { ...acc, [lang]: entry }
                                },
                                {},
                            ) ?? {},
                        language: hallDetails.translations?.[0]?.languageCode || 'en',
                        name: hallDetails.translations?.[0]?.name || '',
                        description: hallDetails.translations?.[0]?.description || '',
                    }
                    : initialValues
            }
            validationSchema={getHallValidationSchema(t)}
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
                const submitting = isSubmitting

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

                                                        const updatedStore = {
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
                                                {t('halls.coverImage')} (16:9)
                                            </label>
                                            <HallImageUpload />
                                        </div>
                                    </BackgroundRounded>
                                </div>

                                {/* Right Column - Publishing & Classification (lg:col-span-1) */}
                                <div className="lg:col-span-1 space-y-4">
                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('halls.publishing')}
                                            icon={<Icon name="show" />}
                                        />

                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${values.status === "active" ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <label className="text-sm font-medium">
                                                    {t('halls.activeStatus')}
                                                </label>
                                            </div>
                                            <Field name="status">
                                                {({ field, form }: FieldProps<string>) => (
                                                    <Switcher
                                                        checked={field.value === 'active'}
                                                        onChange={(checked) => {
                                                            form.setFieldValue(
                                                                field.name,
                                                                checked ? 'active' : 'hidden',
                                                            )
                                                        }}
                                                    />
                                                )}
                                            </Field>
                                        </div>

                                        <div className="py-3 mt-2">
                                            <FormItem
                                                asterisk
                                                label={t('halls.sortOrder')}
                                                invalid={Boolean(touched.sortOrder && errors.sortOrder)}
                                                errorMessage={errors.sortOrder}
                                            >
                                                <Field
                                                    name="sortOrder"
                                                    type="number"
                                                    component={Input}
                                                    placeholder={t('halls.sortOrderPlaceholder')}
                                                />
                                            </FormItem>
                                        </div>
                                    </BackgroundRounded>

                                    <BackgroundRounded className="px-6">
                                        <HeaderInformation
                                            title={t('halls.classification')}
                                            icon={<Icon name="classification" />}
                                        />

                                        <div className="py-3">
                                            <Radio.Group
                                                vertical
                                                value={hallType}
                                                onChange={(val) => {
                                                    setHallType(val)
                                                    if (val === 'main') {
                                                        setFieldValue('parentId', null)
                                                    }
                                                }}
                                                className="w-full space-y-4"
                                            >
                                                <div
                                                    className={getOptionClasses('main')}
                                                    onClick={() => {
                                                        setHallType('main')
                                                        setFieldValue('parentId', null)
                                                    }}
                                                >
                                                    <div className="flex gap-4 w-full">
                                                        <Radio value="main" />
                                                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm">
                                                            {t('halls.parentHall')}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div
                                                    className={getOptionClasses('sub', 'flex-col')}
                                                    onClick={() => setHallType('sub')}
                                                >
                                                    <div className="flex gap-4 w-full">
                                                        <Radio value="sub" />
                                                        <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm block mb-1">
                                                            {t('halls.subHall')}
                                                        </span>
                                                    </div>

                                                    {hallType === 'sub' && (
                                                        <div
                                                            className="w-full mt-1 pt-2 border-t border-dashed border-neutral-100 dark:border-neutral-700"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <label className="block text-[11px] font-bold text-primary-500 dark:text-primary-100 uppercase tracking-wider mb-2">
                                                                {t('halls.selectParent')}
                                                            </label>
                                                            <CategorySelect
                                                                size="sm"
                                                                placeholder={t('halls.selectParent')}
                                                                value={values.parentId}
                                                                initialOption={hallDetails?.parent as any}
                                                                menuPortalZ={400}
                                                                onChange={(opt) => setFieldValue('parentId', opt ?? null)}
                                                            />
                                                            {touched.parentId && errors.parentId && (
                                                                <div className="text-xs text-red-500 mt-1">
                                                                    {errors.parentId as string}
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
                                    disabled={submitting}
                                >
                                    {isUpdateMode
                                        ? t('halls.update.submit')
                                        : t('halls.create.submit')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormHall
