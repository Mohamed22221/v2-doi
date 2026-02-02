import { UserItem } from '@/api/types/users'

export type SellerDocumentType = 'national_id' | 'commercial_certificate' | 'tax_certificate'

export type SellerDocument = {
    type: SellerDocumentType
    notes: string | null
    fileUrl: string
    verified: boolean
    uploadedAt: string
}

export interface SellerUser extends UserItem {
    roleId: number
    failedLoginAttempts: number
    lastLogin: string | null
    lastPasswordChange: string
    language: 'EN' | 'AR'
    updatedAt: string
}

export interface SellerItem {
    id: string
    user: SellerUser
    businessDescription: string | null
    businessName: string | null
    businessPhone: string | null
    commercialRegistrationNumber: string | null
    nationalIdNumber: string | null
    isVerified: boolean
    verifiedAt: string | null
    documents: SellerDocument[]
    // Computed status based on isVerified
    status: 'approved' | 'rejected' | 'pending'
}

// Helper to get user name
export const getSellerName = (seller: SellerItem) => {
    return `${seller.user.firstName} ${seller.user.lastName}`
}

// Use stable IDs instead of random UUIDs
const generateStableId = (prefix: string, index: number) =>
    `${prefix}-${String(index).padStart(8, '0')}`

export const SELLERS_MOCK: SellerItem[] = Array.from({ length: 1250 }).map((_, index) => {
    const id = generateStableId('seller', index)
    const userId = generateStableId('user', index)

    const firstNames = ['Ahmed', 'Ron', 'Luke', 'Joyce', 'John', 'Sarah', 'Mohamed', 'Ali']
    const lastNames = ['Kotp', 'Vargas', 'Cook', 'Freeman', 'Doe', 'Smith', 'Hassan', 'Ibrahim']

    const firstName = firstNames[index % firstNames.length]
    const lastName = lastNames[index % lastNames.length]

    const statuses: ('approved' | 'rejected' | 'pending')[] = ['approved', 'rejected', 'pending', 'pending']
    const status = statuses[index % statuses.length]
    const isVerified = status === 'approved'

    const businessNames = ['Urban Trend Store', 'Elite Electronics', 'Tech Solutions', 'Fashion Hub', null]
    const businessDescriptions = ['Leading electronics retailer', 'Fashion and accessories', 'Technology solutions provider', null]

    return {
        id,
        user: {
            id: userId,
            firstName,
            lastName,
            email: `${firstName.toLowerCase()}_${lastName.toLowerCase()}${index}@test.com`,
            phone: `+9665123432${String(10 + (index % 90)).padStart(2, '0')}`,
            region: '',
            isActive: isVerified,
            isDeleted: index < 5,
            deletedAt: index < 5 ? new Date(2026, 0, 15, 14, 30).toISOString() : null,
            createdAt: new Date(2025, 11, 21, 13, 32, 45).toISOString(),
            updatedAt: new Date(2026, 0, 18, 12, 19, 4).toISOString(),
            role: {
                id: '3',
                name: 'Seller'
            },
            roleId: 3,
            image: index % 3 === 0
                ? 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
                : undefined,
            isPhoneVerified: index % 2 === 0,
            isEmailVerified: index % 3 === 0,
            failedLoginAttempts: 0,
            lastLogin: index % 4 === 0 ? new Date(2026, 0, 15, 10, 30).toISOString() : null,
            lastPasswordChange: new Date(2025, 11, 21, 13, 32, 45).toISOString(),
            language: index % 2 === 0 ? 'EN' : 'AR',
        },
        businessDescription: businessDescriptions[index % businessDescriptions.length],
        businessName: businessNames[index % businessNames.length],
        businessPhone: index % 2 === 0 ? `+9665${5000000 + index}` : null,
        commercialRegistrationNumber: index % 3 === 0 ? `CR${1000000 + index}` : null,
        nationalIdNumber: `9682341546${5983 + index}`,
        isVerified,
        verifiedAt: isVerified ? new Date(2026, 0, 10, 14, 0).toISOString() : null,
        status,
        documents: [
            {
                type: 'national_id',
                notes: 'front side',
                fileUrl: `http://localhost:3000/uploads/sellers/documents/doc-${index}-national.jpg`,
                verified: isVerified,
                uploadedAt: new Date(2025, 11, 21, 13, 33, 9).toISOString()
            },
            ...(index % 2 === 0 ? [{
                type: 'commercial_certificate' as SellerDocumentType,
                notes: 'company registration',
                fileUrl: `http://localhost:3000/uploads/sellers/documents/doc-${index}-commercial.jpg`,
                verified: isVerified,
                uploadedAt: new Date(2025, 11, 22, 10, 15, 0).toISOString()
            }] : [])
        ]
    }
})

export const getSellerById = (id: string): SellerItem | undefined => {
    return SELLERS_MOCK.find(s => s.id === id)
}
