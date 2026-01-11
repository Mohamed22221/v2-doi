import VerifyOtpForm from './components/VerifyOtpForm'

const VerifyOtp = () => {
    return (
        <>
            <div className="mb-8">
                <h3 className="mb-1">Verify OTP</h3>
                <p>Please enter the 4-digit OTP code to continue.</p>
            </div>

            <VerifyOtpForm disableSubmit={false} />
        </>
    )
}

export default VerifyOtp
