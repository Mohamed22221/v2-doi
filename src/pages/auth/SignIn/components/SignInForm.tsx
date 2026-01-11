import { Field, Form, Formik } from 'formik'
// UI Components
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import ActionLink from '@/components/shared/ActionLink'
import PasswordInput from '@/components/shared/PasswordInput'
// API
import { useLogin } from '@/api/hooks/auth'
import { getApiErrorMessage } from '@/api/error'
// Validation
import { isEmail } from '@/components/validation/email'
import { normalizePhone } from '@/components/validation/phone'
import validationSchema from './schema'
// Hooks
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
// Types
import type { SignInFormProps, SignInFormSchema, SignInPayload } from './types'

const SignInForm = ({
    disableSubmit = false,
    className,
    forgotPasswordUrl = '/forgot-password',
}: SignInFormProps) => {
    const { login, isPending } = useLogin()
    const [message, setMessage] = useTimeOutMessage()

    const handleSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setMessage('')

        const identifier = values.identifier.trim()
        const payload: SignInPayload = {
            password: values.password,
            platform: 'web',
        }

        if (isEmail(identifier)) {
            payload.email = identifier
        } else {
            payload.phone = normalizePhone(identifier)
        }

        try {
            await login(payload)
        } catch (error) {
            setMessage(getApiErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }

    const initialValues: SignInFormSchema = {
        identifier: '',
        password: '',
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
                                    label="Email or Phone"
                                    invalid={Boolean(
                                        touched.identifier && errors.identifier,
                                    )}
                                    errorMessage={errors.identifier}
                                >
                                    <Field
                                        type="text"
                                        name="identifier"
                                        autoComplete="username"
                                        placeholder="Email or Phone (test@mail.com or +966501234567)"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Password"
                                    invalid={Boolean(
                                        touched.password && errors.password,
                                    )}
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        name="password"
                                        autoComplete="current-password"
                                        placeholder="Password"
                                        component={PasswordInput}
                                    />
                                </FormItem>

                                <div className="flex justify-end mb-6">
                                    <ActionLink to={forgotPasswordUrl}>
                                        Forgot Password?
                                    </ActionLink>
                                </div>

                                <Button
                                    block
                                    variant="solid"
                                    type="submit"
                                    loading={isFormSubmitting}
                                    disabled={isFormSubmitting || disableSubmit}
                                >
                                    {isFormSubmitting
                                        ? 'Signing in...'
                                        : 'Sign In'}
                                </Button>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default SignInForm
