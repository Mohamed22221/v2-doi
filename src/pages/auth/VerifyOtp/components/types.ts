
import type { CommonProps, Platform } from '@/@types/common'



export interface OtpFormProps extends CommonProps {
  disableSubmit?: boolean
  forgotPasswordUrl?: string
}
export interface VerifyOtpPayload {
  otpSessionId: string
  code: string
  fcmToken?: string
  platform?: Platform
}

export type OtpFormSchema = {
  code: string 
}