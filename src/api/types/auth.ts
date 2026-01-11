
export type LoginRequest = {
    email?: string
    phone?: string
    password: string
    fcmToken?: string
    platform?: 'web' | 'ios' | 'android'
}

export type LoginResponse = {
    access_token: string
    user: {
        id: string
        email: string 
        phone: string 
        language: string
}
}



// New login types for email/phone login
