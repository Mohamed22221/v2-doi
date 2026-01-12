import { Field, Form, Formik } from 'formik'
// UI Components
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
// API
import {
    useResendOtp,
    useVerifyForgotOtp,
    useVerifyOtp,
} from '@/api/hooks/auth'
import { getApiErrorMessage } from '@/api/error'
// Validation
import validationSchema from './schema'
// Hooks
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
// Types
import type { OtpFormProps, VerifyOtpPayload } from './types'
import ResendOtp from './ResendOtp'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Notification, toast } from '@/components/ui'

const VerifyOtpForm = ({ disableSubmit = false, className }: OtpFormProps) => {
    const { verifyOtp, isPending } = useVerifyOtp()
    const { verifyForgotOtp, isPending: isVerifyForgotOtpPending } =
        useVerifyForgotOtp()

    const { resendOtp, isSuccess } = useResendOtp()
    const [message, setMessage] = useTimeOutMessage()
    const { state } = useLocation()

    // Retrieve stored OTP session ID and code
    const [initialValues, setInitialValues] = useState<VerifyOtpPayload>({
        otpSessionId: '',
        code: '',
    })
    // Handle form submission

    const handleSignIn = async (
        values: VerifyOtpPayload,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setMessage('')

        const payload: VerifyOtpPayload = {
            code: values.code || initialValues.code,
            otpSessionId: initialValues.otpSessionId,
            platform: 'web',
        }

        try {
            if (state?.otp === 'forgot') {
                const payloadVerify = {
                    phone: localStorage.getItem('forgot-phone') || '',
                    sessionId: initialValues.otpSessionId,
                    otp: values.code || initialValues.code,
                }
                await verifyForgotOtp(payloadVerify)
            } else {
                await verifyOtp(payload)
                toast.push(
                    <Notification title="Sign in successful" type="success" />,
                )
            }
        } catch (error) {
            setMessage(getApiErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }
    // Initial form values

    useEffect(() => {
        const storedOtpSessionId = localStorage.getItem('otp-session-id') || ''
        const storedOtpCode = localStorage.getItem('otp-code') || ''
        setInitialValues({
            otpSessionId: storedOtpSessionId,
            code: storedOtpCode,
        })
    }, [isSuccess])

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger" duration={6000}>
                    {message}
                </Alert>
            )}

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (disableSubmit) return setSubmitting(false)
                    handleSignIn(values, setSubmitting)
                }}
            >
                {({ touched, errors, isSubmitting }) => {
                    const isFormSubmitting =
                        isSubmitting || isPending || isVerifyForgotOtpPending

                    return (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label="OTP Code"
                                    invalid={Boolean(
                                        touched.code && errors.code,
                                    )}
                                    errorMessage={errors.code}
                                >
                                    <Field
                                        type="text"
                                        name="code"
                                        autoComplete="one-time-code"
                                        placeholder="Enter OTP Code"
                                        component={Input}
                                        maxLength={4}
                                        inputMode="numeric"
                                    />
                                </FormItem>

                                <ResendOtp
                                    setMessage={setMessage}
                                    onResend={(payload) =>
                                        resendOtp(payload).then(() => {})
                                    }
                                />

                                <Button
                                    block
                                    variant="solid"
                                    type="submit"
                                    loading={
                                        isFormSubmitting ||
                                        isVerifyForgotOtpPending
                                    }
                                    disabled={
                                        isFormSubmitting ||
                                        isVerifyForgotOtpPending ||
                                        disableSubmit
                                    }
                                >
                                    {isFormSubmitting
                                        ? 'Verifying...'
                                        : 'Verify OTP'}
                                </Button>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default VerifyOtpForm
