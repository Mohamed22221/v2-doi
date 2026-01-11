import { Field, Form, Formik } from 'formik'
// UI Components
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
// API
import { useVerifyOtp } from '@/api/hooks/auth'
import { getApiErrorMessage } from '@/api/error'
// Validation
import validationSchema from './schema'
// Hooks
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
// Types
import type { OtpFormProps, VerifyOtpPayload } from './types'

const VerifyOtpForm = ({ disableSubmit = false, className }: OtpFormProps) => {
    const { verifyOtp, isPending } = useVerifyOtp()
    const [message, setMessage] = useTimeOutMessage()
    // Retrieve stored OTP session ID and code
    const getOtpSessionId = localStorage.getItem('otp-session-id') || ''
    const otpCode = localStorage.getItem('otp-code') || ''
    // Handle form submission

    const handleSignIn = async (
        values: VerifyOtpPayload,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setMessage('')

        const payload: VerifyOtpPayload = {
            code: values.code || otpCode,
            otpSessionId: getOtpSessionId,
            platform: 'web',
        }

        try {
            await verifyOtp(payload)
        } catch (error) {
            setMessage(getApiErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }
    // Initial form values
    const initialValues: VerifyOtpPayload = {
        otpSessionId: getOtpSessionId,
        code: otpCode,
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger" duration={6000}>
                    {message}
                </Alert>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (disableSubmit) return setSubmitting(false)
                    handleSignIn(values, setSubmitting)
                }}
            >
                {({ touched, errors, isSubmitting }) => {
                    const isFormSubmitting = isSubmitting || isPending

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

                                <div className="flex justify-center mb-6">
                                    <span className="text-sm text-gray-600">
                                        Didn&apos;t receive the code?
                                    </span>
                                    &nbsp;
                                    <a
                                        href="#"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Resend OTP
                                    </a>
                                </div>

                                <Button
                                    block
                                    variant="solid"
                                    type="submit"
                                    loading={isFormSubmitting}
                                    disabled={isFormSubmitting || disableSubmit}
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
