import { BaseEntity } from './common'

export type TApprovalStatus = 'approved' | 'pending' | 'rejected'
export type TAccountStatus = 'active' | 'suspended' | 'deleted'

export interface SellerUser extends BaseEntity {
    firstName: string
    lastName: string
    email: string
    phone: string
    roleId: number
    isActive: boolean
    failedLoginAttempts: number
    lastLogin: string | null
    lastPasswordChange: string
    image: string | null
    isPhoneVerified: boolean
    isEmailVerified: boolean
    language: string
}

export interface SellerDocument {
    type: string
    notes: string
    fileUrl: string
    verified: boolean
    uploadedAt: string
}

export interface SellerItem {
    id: string
    user: SellerUser
    businessDescription: string | null
    businessName: string | null
    businessPhone: string | null
    businessAddress: string | null
    commercialRegistrationNumber: string | null
    nationalIdNumber: string | null
    approvalStatus: TApprovalStatus
    accountStatus: TAccountStatus
    reason: string | null
    verifiedAt: string | null
    documents: SellerDocument[]
}

export interface TSellersParams {
    page: number
    limit: number
    search?: string
    isVerified?: boolean
}

export interface TSellerActionPayload {
    reason: string
}
