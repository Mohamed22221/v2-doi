import { useTranslation } from 'react-i18next'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormContainer } from '@/components/ui/Form'
import FormDesription from '../../components/FormDesription'
import FormRow from '../../components/FormRow'
import { Field, Form, Formik } from 'formik'
import {
    HiOutlineMail,
    HiOutlineBriefcase,
    HiOutlinePhone,
} from 'react-icons/hi'

export type ProfileFormModel = {
    role: string
    email: string
    phone: string
}

type ProfileProps = {
    data?: ProfileFormModel
}

const FormUpdateProfile = ({
    data = {
        email: '',
        role: '',
        phone: '',
    },
}: ProfileProps) => {
    const { t } = useTranslation()
    const onFormSubmit = (
        values: ProfileFormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        console.log('values', values)
        toast.push(<Notification title={t('settings.profile.success')} type="success" />, {
            placement: 'top-center',
        })
        setSubmitting(false)
    }

    return (
        <Formik
            enableReinitialize
            initialValues={data}
            onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true)
                setTimeout(() => {
                    onFormSubmit(values, setSubmitting)
                }, 1000)
            }}
        >
            {({ touched, errors, isSubmitting, resetForm }) => {
                const validatorProps = { touched, errors }
                return (
                    <Form>
                        <FormContainer>
                            <FormDesription
                                title={t('settings.profile.title')}
                                desc={t('settings.profile.description')}
                            />
                            <FormRow
                                name="email"
                                label={t('settings.profile.email')}
                                {...validatorProps}
                                border={false}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder={t('settings.profile.email')}
                                    component={Input}
                                    prefix={
                                        <HiOutlineMail className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="phone"
                                label={t('settings.profile.phone')}
                                {...validatorProps}
                                border={false}
                            >
                                <Field
                                    type="tel"
                                    autoComplete="off"
                                    name="phone"
                                    placeholder={t('settings.profile.phone')}
                                    component={Input}
                                    prefix={
                                        <HiOutlinePhone className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="role"
                                label={t('settings.profile.role')}
                                {...validatorProps}

                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="role"
                                    placeholder={t('settings.profile.role')}
                                    component={Input}
                                    disabled={true}
                                    prefix={
                                        <HiOutlineBriefcase className="text-xl" />
                                    }
                                />
                            </FormRow>

                            <div className="mt-4 ltr:text-right">
                                <Button
                                    className="ltr:mr-2 rtl:ml-2"
                                    type="button"
                                    onClick={() => resetForm()}
                                >
                                    {t('settings.profile.reset')}
                                </Button>
                                <Button
                                    variant="solid"
                                    loading={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? t('settings.profile.updating') : t('settings.profile.update')}
                                </Button>
                            </div>
                        </FormContainer>
                    </Form>
                )
            }}
        </Formik>
    )
}

export default FormUpdateProfile
