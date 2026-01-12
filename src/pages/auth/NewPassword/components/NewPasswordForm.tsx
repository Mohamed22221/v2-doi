import { useState } from 'react'
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
// import type { AxiosError } from 'axios'

interface NewPasswordForm extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type NewPasswordFormSchema = {
    password: string
}

const validationSchema = Yup.object().shape({
    password: Yup.string().trim().required('Password is required'),
})

const NewPasswordForm = (props: NewPasswordForm) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props
    const { newPassword } = useNewPassword()
    const [emailSent] = useState(false)
    const { state } = useLocation()
    const [message, setMessage] = useTimeOutMessage()

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
            toast.push(<Notification title="Password updated" type="success" />)
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
                    <h3 className="mb-1">New Password</h3>
                    <p>
                        Please enter your new password below to update your
                        account.
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
                                        placeholder="new password"
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
                                    ? 'Updating Password'
                                    : 'Update Password'}
                            </Button>
                            <div className="mt-4 text-center">
                                <span>Back to </span>
                                <ActionLink to={signInUrl}>Sign in</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default NewPasswordForm
