
export type LocalizedEntity = {
  id: string
  name: string
  nameAr: string
}
export type ApiAddress = {
  id: string
  userId: string
  addressDetails: string
  apartmentNumber: string
  buildingNumber: string
  floorNumber: string
  areaId: string
  area: LocalizedEntity
  cityId: string
  city: LocalizedEntity
  regionId: string
  region: LocalizedEntity
  gpsLatitude: number
  gpsLongitude: number
  isPrimary: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
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
  isDeleted: boolean
  deletedAt: null | string
  addresses?: ApiAddress[]
}

export type TUserPayload = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password?: string
  roleId: number
  isActive: boolean
  image: string

}

