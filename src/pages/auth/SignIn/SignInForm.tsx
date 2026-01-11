import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useLogin } from '@/api/hooks/auth'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { getApiErrorMessage } from '@/api/error'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
    signUpUrl?: string
}

type SignInFormSchema = {
    identifier: string
    password: string
}

interface SignInPayload {
    email?: string
    phone?: string
    password: string
    platform: 'web'
}

// E.164 phone regex: starts with +, followed by 1-15 digits
const phoneRegex = /^\+[1-9]\d{7,14}$/

const normalizePhone = (value: string) => value.replace(/[\s-]/g, '').trim()

const isEmail = (value: string) =>
    Yup.string().email().isValidSync(value.trim())

const isPhone = (value: string) => phoneRegex.test(normalizePhone(value))

const validationSchema = Yup.object().shape({
    identifier: Yup.string()
        .trim()
        .required('Email or phone number is required')
        .test(
            'email-or-phone',
            'Please enter a valid email or a valid phone number  (e.g., +966501234567)',
            (value) => {
                if (!value) return false
                return isEmail(value) || isPhone(value)
            },
        ),
    password: Yup.string().required('Please enter your password'),
})

const SignInForm = (props: SignInFormProps) => {
    const {
        disableSubmit = false,
        className,
        forgotPasswordUrl = '/forgot-password',
        signUpUrl = '/sign-up',
    } = props

    const [message, setMessage] = useTimeOutMessage()
    const { login, isPending } = useLogin()

    const onSignIn = async (
        values: SignInFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        const { identifier, password } = values

        setMessage('')

        const trimmedIdentifier = identifier.trim()

        const loginPayload: SignInPayload = {
            password,
            platform: 'web',
        }

        // Send only ONE of them
        if (isEmail(trimmedIdentifier)) {
            loginPayload.email = trimmedIdentifier
        } else {
            loginPayload.phone = normalizePhone(trimmedIdentifier)
        }

        try {
            await login(loginPayload)
        } catch (error) {
            const errorMsg = getApiErrorMessage(error)
            setMessage(errorMsg)
        } finally {
            setSubmitting(false)
        }
    }

    const displayError = message

    return (
        <div className={className}>
            {displayError && (
                <Alert showIcon className="mb-4" type="danger">
                    <>{displayError}</>
                </Alert>
            )}

            <Formik
                initialValues={{
                    identifier: '',
                    password: '',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignIn(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => {
                    const isFormSubmitting = isSubmitting || isPending

                    return (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label="Email or Phone"
                                    invalid={
                                        (errors.identifier &&
                                            touched.identifier) as boolean
                                    }
                                    errorMessage={errors.identifier}
                                >
                                    <Field
                                        type="text"
                                        autoComplete="username"
                                        name="identifier"
                                        placeholder="Email or Phone (test@mail.com or +966501234567)"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Password"
                                    invalid={
                                        (errors.password &&
                                            touched.password) as boolean
                                    }
                                    errorMessage={errors.password}
                                >
                                    <Field
                                        autoComplete="current-password"
                                        name="password"
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
                                    loading={isFormSubmitting}
                                    variant="solid"
                                    type="submit"
                                    disabled={isFormSubmitting || disableSubmit}
                                >
                                    {isFormSubmitting
                                        ? 'Signing in...'
                                        : 'Sign In'}
                                </Button>

                                <div className="mt-4 text-center">
                                    <span>{`Don't have an account yet?`} </span>
                                    <ActionLink to={signUpUrl}>
                                        Sign up
                                    </ActionLink>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default SignInForm
