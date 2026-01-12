import { Button } from '@/components/ui'
import { useEffect, useState } from 'react'

const RESEND_SECONDS = 60
interface ResendOtpProps {
    setMessage: (message: string) => void
    onResend: (payload: { otpSessionId: string }) => Promise<void>
}
const ResendOtp = ({ setMessage, onResend }: ResendOtpProps) => {
    const [resendIn, setResendIn] = useState(0)
    const [isResending, setIsResending] = useState(false)

    // timer
    useEffect(() => {
        if (resendIn <= 0) return

        const id = setInterval(() => {
            setResendIn((s) => (s > 0 ? s - 1 : 0))
        }, 1000)

        return () => clearInterval(id)
    }, [resendIn])

    const handleResend = async () => {
        if (isResending || resendIn > 0) return

        setIsResending(true)
        try {
            const otpSessionId = localStorage.getItem('otp-session-id') || ''
            await onResend({ otpSessionId })
            setResendIn(RESEND_SECONDS)
        } catch (error) {
            setMessage('Failed to resend OTP')
        } finally {
            setIsResending(false)
        }
    }

    const mm = Math.floor(resendIn / 60)
    const ss = String(resendIn % 60).padStart(2, '0')

    return (
        <div className="flex justify-center items-center mb-6  text-sm">
            <span className="text-gray-600">Didn&apos;t receive the code?</span>

            {resendIn > 0 ? (
                <span className="font-semibold opacity-70">
                    Resend in {mm}:{ss}
                </span>
            ) : (
                <Button
                    type="button"
                    disabled={isResending}
                    size="xs"
                    variant="link"
                    loading={isResending}
                    onClick={handleResend}
                >
                    {isResending ? 'Sending...' : 'Resend OTP'}
                </Button>
            )}
        </div>
    )
}

export default ResendOtp
