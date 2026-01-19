import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Field, FieldProps, Form, Formik } from 'formik'

// UI
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Notification, Select, toast } from '@/components/ui'

// API hooks
import {
    useCreateUser,
    useGetUserDetails,
    useUpdateUser,
} from '@/api/hooks/users'
import { getApiErrorMessage } from '@/api/error'

// Validation
import getUserValidationSchema from './schema'

// Utils
import { TUserPayload } from '@/api/types/users'
import { useInfiniteRoles } from '@/api/hooks/roles'
import { PasswordInput } from '@/components/shared'
import UserImageUpload from './userImageUpload'
import FormUpdateSkeleton from './FormUpdateSkeleton'
import ErrorState from '@/components/shared/ErrorState'

// Types
type RoleOption = {
    label: string
    value: number
}

const FormUpdate = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const isUpdateMode = Boolean(id)
    const { t } = useTranslation()

    const {
        data: userDetails,
        isLoading,
        isError,
        error
    } = useGetUserDetails(id as string, {
        enabled: isUpdateMode,
    })

    const { mutateAsync: createUser, isPending: isCreating } = useCreateUser()
    const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser()

    const {
        data: rolesData,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
        isLoading: isLoadingRoles,
        isError: isRolesError,
    } = useInfiniteRoles()

    const roleOptions: RoleOption[] =
        rolesData?.items?.map((r) => ({
            label: r.name,
            value: Number(r.id),
        })) ?? []

    const initialValues: TUserPayload = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        roleId: 0,
        isActive: true,
        image: '',
    }

    const handleSubmit = async (
        values: TUserPayload,
        setSubmitting: (v: boolean) => void,
    ) => {
        try {
            if (isUpdateMode && id) {
                await updateUser({ id, data: values })
                toast.push(
                    <Notification
                        title={t('users.update.success')}
                        type="success"
                    />,
                )
            } else {
                await createUser(values)
                toast.push(
                    <Notification
                        title={t('users.create.success')}
                        type="success"
                    />,
                )
            }
        } catch (error) {
            toast.push(
                <Notification
                    title={getApiErrorMessage(error)}
                    type="danger"
                />,
            )
        } finally {
            setSubmitting(false)
        }
    }
    if (isLoading) {
        return <FormUpdateSkeleton />
    }

    if (isError) {
        return (
            <div>
                <ErrorState message={error?.message} fullPage={true} />
            </div>
        )
    }
    return (
        <div>
            <Formik
                enableReinitialize
                initialValues={
                    isUpdateMode && userDetails?.data
                        ? {
                              firstName: userDetails.data.firstName ?? '',
                              lastName: userDetails.data.lastName ?? '',
                              email: userDetails.data.email ?? '',
                              phone: userDetails.data.phone ?? '',
                              password: '',
                              roleId: userDetails.data.role?.id
                                  ? Number(userDetails.data.role.id)
                                  : 0,
                              isActive: userDetails.data.isActive ?? true,
                              image: userDetails.data.image ?? '',
                          }
                        : initialValues
                }
                validationSchema={getUserValidationSchema(t)}
                onSubmit={(values, { setSubmitting }) =>
                    handleSubmit(values, setSubmitting)
                }
            >
                {({ touched, errors, isSubmitting }) => {
                    const submitting = isSubmitting || isCreating || isUpdating
                    return (
                        <Form>
                            <FormContainer>
                                <UserImageUpload uploadType="user_profile" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem
                                        label={t('users.firstName')}
                                        invalid={Boolean(
                                            touched.firstName &&
                                                errors.firstName,
                                        )}
                                        errorMessage={errors.firstName}
                                    >
                                        <Field
                                            name="firstName"
                                            component={Input}
                                        />
                                    </FormItem>

                                    <FormItem
                                        label={t('users.lastName')}
                                        invalid={Boolean(
                                            touched.lastName && errors.lastName,
                                        )}
                                        errorMessage={errors.lastName}
                                    >
                                        <Field
                                            name="lastName"
                                            component={Input}
                                        />
                                    </FormItem>
                                </div>

                                {/* Email + Phone (RESPONSIVE) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem
                                        label={t('users.email')}
                                        invalid={Boolean(
                                            touched.email && errors.email,
                                        )}
                                        errorMessage={errors.email}
                                    >
                                        <Field name="email" component={Input} />
                                    </FormItem>

                                    <FormItem
                                        label={t('users.phone')}
                                        invalid={Boolean(
                                            touched.phone && errors.phone,
                                        )}
                                        errorMessage={errors.phone}
                                    >
                                        <Field name="phone" component={Input} />
                                    </FormItem>
                                </div>

                                {/* Role + Password (+ spacer) (RESPONSIVE) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormItem
                                        label={t('users.role')}
                                        invalid={Boolean(
                                            touched.roleId && errors.roleId,
                                        )}
                                        errorMessage={errors.roleId}
                                    >
                                        <Field name="roleId">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<number>) => {
                                                const selected =
                                                    roleOptions.find(
                                                        (o) =>
                                                            o.value ===
                                                            field.value,
                                                    ) ?? null

                                                return (
                                                    <Select<RoleOption>
                                                        size="sm"
                                                        isSearchable={false}
                                                        placeholder={t(
                                                            'users.rolePlaceholder',
                                                        )}
                                                        value={selected}
                                                        options={roleOptions}
                                                        maxMenuHeight={230}
                                                        hasMore={hasNextPage}
                                                        isLoadingMore={
                                                            isFetchingNextPage
                                                        }
                                                        loadMoreLabel={t(
                                                            'viewTable.filters.loadMore',
                                                        )}
                                                        onLoadMore={() =>
                                                            fetchNextPage()
                                                        }
                                                        isLoading={
                                                            isLoadingRoles
                                                        }
                                                        onChange={(option) =>
                                                            form.setFieldValue(
                                                                field.name,
                                                                option?.value ??
                                                                    0,
                                                            )
                                                        }
                                                    />
                                                )
                                            }}
                                        </Field>

                                        {isRolesError && (
                                            <div className="text-xs text-red-500 mt-1">
                                                {t('users.rolesLoadError')}
                                            </div>
                                        )}
                                    </FormItem>

                                    <FormItem
                                        label={t('users.password')}
                                        invalid={Boolean(
                                            touched.password && errors.password,
                                        )}
                                        errorMessage={errors.password}
                                    >
                                        <Field
                                            name="password"
                                            type="password"
                                            component={PasswordInput}
                                        />
                                    </FormItem>

                                    <div />
                                </div>

                                {/* Status (RESPONSIVE wrapper, same layout) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <FormItem label={t('users.isActive')}>
                                        <Field name="isActive">
                                            {({
                                                field,
                                                form,
                                            }: FieldProps<boolean>) => (
                                                <Switcher
                                                    field={{
                                                        name: field.name,
                                                        value: field.value,
                                                        checked: field.value,
                                                    }}
                                                    onChange={(checked) => {
                                                        form.setFieldValue(
                                                            field.name,
                                                            checked,
                                                        )
                                                    }}
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                </div>

                                <div className="flex items-center gap-3 mt-6">
                                    <Button
                                        type="button"
                                        variant="default"
                                        onClick={() => navigate(-1)}
                                        disabled={submitting}
                                    >
                                        {t('common.back')}
                                    </Button>

                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={submitting}
                                        disabled={submitting || isLoading}
                                    >
                                        {isUpdateMode
                                            ? t('users.update.submit')
                                            : t('users.create.submit')}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default FormUpdate
