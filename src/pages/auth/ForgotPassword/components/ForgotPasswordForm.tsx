import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'

import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { useForgotPassword } from '@/api/hooks/auth'
import { isPhone } from '@/components/validation/phone'
import { getApiErrorMessage } from '@/api/error'
// import type { AxiosError } from 'axios'

interface ForgotPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ForgotPasswordFormSchema = {
    phone: string
}

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
    const { t } = useTranslation()
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const { forgotPassword } = useForgotPassword()
    const [emailSent] = useState(false)

    const [message, setMessage] = useTimeOutMessage()

    const validationSchema = Yup.object().shape({
        phone: Yup.string()
            .trim()
            .required(t('auth.errors.phoneRequired'))
            .test(
                'phone',
                t('auth.errors.invalidPhone'),
                (value) => {
                    if (!value) return false
                    return isPhone(value)
                },
            ),
    })

    const onSendPhone = async (
        values: ForgotPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setMessage('')

        try {
            await forgotPassword(values)
            localStorage.setItem('forgot-phone', values.phone)  
        } catch (error) {
            setMessage(getApiErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={className}>
            <div className="mb-6">
                <>
                    <h3 className="mb-1">{t('auth.forgot.title')}</h3>
                    <p>
                        {t('auth.forgot.subtitle')}
                    </p>
                </>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger" duration={7000}>
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    phone: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSendPhone(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <div className={emailSent ? 'hidden' : ''}>
                                <FormItem
                                    invalid={errors.phone && touched.phone}
                                    errorMessage={errors.phone}
                                >
                                    <Field
                                        type="phone"
                                        autoComplete="off"
                                        name="phone"
                                        placeholder={t('auth.forgot.phonePlaceholder')}
                                        component={Input}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {emailSent ? t('auth.forgot.resendCode') : t('auth.forgot.sendCode')}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>{t('auth.forgot.backTo')}</span>
                                <ActionLink to={signInUrl}>{t('auth.forgot.signIn')}</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ForgotPasswordForm
