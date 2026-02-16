import { BaseEntity } from './common'
import { UserItem } from './users'

export type TApprovalStatus = 'approved' | 'pending' | 'rejected'
export type TAccountStatus = 'active' | 'suspended' | 'deleted'

export interface SellerUser extends BaseEntity, UserItem {
    failedLoginAttempts: number
    lastLogin: string | null
    lastPasswordChange: string
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
    deletedAt: string | null
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

export interface TSellerPayload {
    firstName: string
    lastName: string
    email: string
    phone: string
    password?: string
    isActive: boolean
    image: string
    businessName: string | null
    businessPhone: string | null
    commercialRegistrationNumber: string | null
}
