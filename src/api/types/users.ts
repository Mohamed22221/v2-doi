export type UserItem = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    region: string
    isActive: boolean
    createdAt: string
    image?: string
    isPhoneVerified?: boolean
    isEmailVerified?: boolean
      role?: {
    id: string
    name: string
  }
}


