
export type LoginRequest = {
    email?: string
    phone?: string
    password: string
    fcmToken?: string
    platform?: 'web' | 'ios' | 'android'
}

export type LoginResponse = {
    access_token: string
    otpSessionId?: string
    code?: string
    user: {
        id: string
        email: string 
        phone: string 
        language: string
}
}

export type VerifyOtpRequest = {
    code: string
    otpSessionId: string
}

export type VerifyOtpResponse = {
    access_token: string
    user: LoginResponse['user']
}
export type ProfileResponse = {
  sub: string;
  phone: string;
  email: string;
  role: string;
};

// New login types for email/phone login
