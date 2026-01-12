import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'

import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'


interface ResetPasswordFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type ResetPasswordFormSchema = {
    password: string
    confirmPassword: string
}

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
    const { t } = useTranslation()
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const [resetComplete] = useState(false)

    const [message] = useTimeOutMessage()

    const navigate = useNavigate()

    const validationSchema = Yup.object().shape({
        password: Yup.string().required(t('auth.errors.passwordRequired')),
        confirmPassword: Yup.string().oneOf(
            [Yup.ref('password')],
            t('auth.errors.passwordsDoNotMatch'),
        ),
    })

    const onSubmit = async (
        values: ResetPasswordFormSchema,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {

        setSubmitting(true)

    }

    const onContinue = () => {
        navigate('/sign-in')
    }

    return (
        <div className={className}>
            <div className="mb-6">
                {resetComplete ? (
                    <>
                        <h3 className="mb-1">{t('auth.reset.done')}</h3>
                        <p>{t('auth.reset.doneSubtitle')}</p>
                    </>
                ) : (
                    <>
                        <h3 className="mb-1">{t('auth.reset.setNewPassword')}</h3>
                        <p>
                            {t('auth.reset.setNewPasswordSubtitle')}
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    password: '123Qwe1',
                    confirmPassword: '123Qwe1',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSubmit(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            {!resetComplete ? (
                                <>
                                    <FormItem
                                        label={t('auth.reset.password')}
                                        invalid={
                                            errors.password && touched.password
                                        }
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="password"
                                            placeholder={t('auth.reset.passwordPlaceholder')}
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label={t('auth.reset.confirmPassword')}
                                        invalid={
                                            errors.confirmPassword &&
                                            touched.confirmPassword
                                        }
                                        errorMessage={errors.confirmPassword}
                                    >
                                        <Field
                                            autoComplete="off"
                                            name="confirmPassword"
                                            placeholder={t('auth.reset.confirmPasswordPlaceholder')}
                                            component={PasswordInput}
                                        />
                                    </FormItem>
                                    <Button
                                        block
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {isSubmitting
                                            ? t('auth.reset.submitting')
                                            : t('auth.reset.submit')}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    block
                                    variant="solid"
                                    type="button"
                                    onClick={onContinue}
                                >
                                    {t('auth.reset.continue')}
                                </Button>
                            )}

                            <div className="mt-4 text-center">
                                <span>{t('auth.reset.backTo')}</span>
                                <ActionLink to={signInUrl}>{t('auth.reset.signIn')}</ActionLink>
                            </div>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ResetPasswordForm
