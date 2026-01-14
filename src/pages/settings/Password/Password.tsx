
import { useTranslation } from 'react-i18next'
// UI Components
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { Alert } from '@/components/ui'
import { FormContainer } from '@/components/ui/Form'
import { PasswordInput } from '@/components/shared'
// Form Components
import { Field, Form, Formik } from 'formik'
import FormDesription from '../components/FormDesription'
import FormRow from '../components/FormRow'

// Validation
import validationSchema from './components/schema'
// API & Hooks
import { useChangePassword } from '@/api/hooks/auth'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { getApiErrorMessage } from '@/api/error'


// Types for form model
type PasswordFormModel = {
    oldPassword: string
    newPassword: string
}

const Password = () => {
    const { t } = useTranslation()
    const { changePassword, isPending } = useChangePassword()
    const [message, setMessage] = useTimeOutMessage()

    // Handle form submit
    const onFormSubmit = async (
        values: PasswordFormModel,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: () => void,
    ) => {
        setMessage('')

        try {
            await changePassword(values)

            // Success notification
            toast.push(
                <Notification title={t('settings.password.success')} type="success" />,
            )

            resetForm()
        } catch (error) {
            // API error handling
            setMessage(getApiErrorMessage(error))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            {/* Error Alert */}
            {message && (
                <Alert
                    showIcon
                    className="mb-4"
                    type="danger"
                    duration={6000}
                >
                    {message}
                </Alert>
            )}

            <Formik
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                }}
                validationSchema={validationSchema(t)}
                onSubmit={(values, { setSubmitting, resetForm }) =>
                    onFormSubmit(values, setSubmitting, resetForm)
                }
            >
                {({ touched, errors, isSubmitting, resetForm }) => {
                    const validatorProps = { touched, errors }
                    const isFormSubmitting = isSubmitting || isPending

                    return (
                        <Form>
                            <FormContainer>
                                {/* Form Header */}
                                <FormDesription
                                    title={t('settings.password.title')}
                                    desc={t('settings.password.description')}
                                />

                                {/* Current Password */}
                                <FormRow
                                    name="oldPassword"
                                    label={t('settings.password.currentPassword')}
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="oldPassword"
                                        placeholder={t('settings.password.currentPassword')}
                                        component={PasswordInput}
                                    />
                                </FormRow>

                                {/* New Password */}
                                <FormRow
                                    name="newPassword"
                                    label={t('settings.password.newPassword')}
                                    {...validatorProps}
                                >
                                    <Field
                                        type="password"
                                        autoComplete="off"
                                        name="newPassword"
                                        placeholder={t('settings.password.newPassword')}
                                        component={PasswordInput}
                                    />
                                </FormRow>

                                {/* Actions */}
                                <div className="mt-4 ltr:text-right">
                                    <Button
                                        className="ltr:mr-2 rtl:ml-2"
                                        type="button"
                                onClick={() => resetForm()}
                                    >
                                        {t('settings.password.reset')}
                                    </Button>

                                    <Button
                                        variant="solid"
                                        loading={isFormSubmitting}
                                        disabled={isFormSubmitting}
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? t('settings.password.updating')
                                            : t('settings.password.updatePassword')}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default Password
