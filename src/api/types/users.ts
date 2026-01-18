type ApiAddress = {
  id?: string
  isPrimary?: boolean | null
  buildingNumber?: string | null
  floorNumber?: string | null
  apartmentNumber?: string | null
  addressDetails?: string | null
  city?: string | null
  area?: string | null
  region?: string | null
  country?: string | null
}
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
  addresses?: ApiAddress[]
}



