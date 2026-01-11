import { CommonProps } from "@/@types/common"

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    forgotPasswordUrl?: string
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
export type { SignInFormProps, SignInFormSchema, SignInPayload }