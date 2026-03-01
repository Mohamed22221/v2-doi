import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormikContext, Field, FieldProps } from 'formik'
import { DatePicker, Input, FormItem, Icon, TimeInput } from '@/components/ui'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import HeaderInformation from '@/components/shared/cards/HeaderInformation'

import { HiOutlineClock, HiOutlineX } from 'react-icons/hi'

const TimeSection = () => {
    const { t } = useTranslation()
    const { errors, touched, setFieldValue } = useFormikContext<any>()
    const timeInputRef = useRef<HTMLInputElement>(null)


    return (
        <BackgroundRounded className="px-6">
            <HeaderInformation
                title={t('halls.time.title')}
                icon={<Icon name="clockColor" />}
            />

            <div className="py-3 space-y-4">
                <FormItem
                    label={t('halls.time.hallDate')}
                    asterisk
                    invalid={Boolean(touched.hallDate && errors.hallDate)}
                    errorMessage={errors.hallDate as string}
                >
                    <Field name="hallDate">
                        {({ field }: FieldProps) => (
                            <DatePicker
                                placeholder={t('halls.time.hallDatePlaceholder')}
                                value={field.value}
                                onChange={(date) => setFieldValue('hallDate', date)}
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem
                    label={t('halls.time.startingTime')}
                    asterisk
                    invalid={Boolean(touched.startingTime && errors.startingTime)}
                    errorMessage={errors.startingTime as string}
                >
                    <Field name="startingTime">
                        {({ field }: FieldProps) => (
                            <Input
                                {...field}
                                ref={timeInputRef}
                                onClick={() =>
                                    timeInputRef.current?.showPicker()
                                }
                                type="time"
                                className='flex justify-end'
                                suffix={
                                    <div className="flex items-center gap-2">
                                        {field.value && (
                                            <HiOutlineX
                                                className="cursor-pointer text-lg hover:text-gray-600"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setFieldValue(
                                                        'startingTime',
                                                        ''
                                                    )
                                                }}
                                            />
                                        )}
                                        <div
                                            className="cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                timeInputRef.current?.showPicker()
                                            }}
                                        >
                                            <HiOutlineClock className="text-lg" />
                                        </div>
                                    </div>
                                }
                            />
                        )}
                    </Field>
                </FormItem>

                <FormItem
                    label={t('halls.time.itemDuration')}
                    asterisk
                    invalid={Boolean(touched.itemDuration && errors.itemDuration)}
                    errorMessage={errors.itemDuration as string}
                >
                    <Field name="itemDuration">
                        {({ field }: FieldProps) => (
                            <Input
                                {...field}
                                type="number"
                                placeholder={t('halls.time.itemDurationPlaceholder')}
                                suffix={<HiOutlineClock className="text-lg" />}
                            />
                        )}
                    </Field>
                </FormItem>
            </div>
        </BackgroundRounded>
    )
}

export default TimeSection
