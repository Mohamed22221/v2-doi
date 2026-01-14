import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import Notification from '@/components/ui/Notification'

import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { useNewPassword } from '@/api/hooks/auth'
import { getApiErrorMessage } from '@/api/error'
import { PasswordInput } from '@/components/shared'
import { useLocation } from 'react-router-dom'
import toast from '@/components/ui/toast/toast'


interface NewPasswordForm extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type NewPasswordFormSchema = {
    password: string
}

const NewPasswordForm = (props: NewPasswordForm) => {
    const { t } = useTranslation()
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const { newPassword } = useNewPassword()
    const [emailSent] = useState(false)
    const { state } = useLocation()
    const [message, setMessage] = useTimeOutMessage()

    const validationSchema = Yup.object().shape({
        password: Yup.string().trim().required(t('auth.errors.passwordIsRequired')),
    })

    const onSendPhone = async (
        values: NewPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setMessage('')

        try {
            await newPassword({
                token: state?.resetToken || '',
                newPassword: values.password,
            })
            // Success notification
            toast.push(<Notification title={t('auth.newPassword.success')} type="success" />)
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
                    <h3 className="mb-1">{t('auth.newPassword.title')}</h3>
                    <p>
                        {t('auth.newPassword.subtitle')}
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
                    password: '',
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
                                    invalid={
                                        errors.password && touched.password
                                    }
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="password"
                                        placeholder={t('auth.newPassword.placeholder')}
                                        component={PasswordInput}
                                    />
                                </FormItem>
                            </div>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {emailSent
                                    ? t('auth.newPassword.updating')
                                    : t('auth.newPassword.update')}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>{t('auth.newPassword.backTo')}</span>
                                <ActionLink to={signInUrl}>{t('auth.newPassword.signIn')}</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default NewPasswordForm
