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
    const onFormSubmit = (
        values: ProfileFormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        console.log('values', values)
        toast.push(<Notification title={'Profile updated'} type="success" />, {
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
                                title="General"
                                desc="Basic info, like your name and address that will displayed in public"
                            />
                            <FormRow
                                name="email"
                                label="Email"
                                {...validatorProps}
                                border={false}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="email"
                                    placeholder="Email"
                                    component={Input}
                                    prefix={
                                        <HiOutlineMail className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="phone"
                                label="Phone"
                                {...validatorProps}
                                border={false}
                            >
                                <Field
                                    type="tel"
                                    autoComplete="off"
                                    name="phone"
                                    placeholder="Phone"
                                    component={Input}
                                    prefix={
                                        <HiOutlinePhone className="text-xl" />
                                    }
                                />
                            </FormRow>
                            <FormRow
                                name="role"
                                label="Role"
                                {...validatorProps}

                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="role"
                                    placeholder="Role"
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
                                    Reset
                                </Button>
                                <Button
                                    variant="solid"
                                    loading={isSubmitting}
                                    type="submit"
                                >
                                    {isSubmitting ? 'Updating' : 'Update'}
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
