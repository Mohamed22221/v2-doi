import { UserItem } from '@/api/types/users'

export type SellerDocument = {
    id: string
    type: 'commercial_register' | 'tax_card'
    title: string
    image: string
    fileUrl: string
}

export interface SellerItem extends UserItem {
    status: 'approved' | 'rejected' | 'pending'
    companyName: string
    contactNumber: string
    commercialRegistrationNumber: string
    documents: SellerDocument[]
}

export const SELLERS_MOCK: SellerItem[] = Array.from({ length: 1250 }).map((_, index) => {
    const id = `USR-${99283 + index}`
    const firstNames = ['Terrance', 'Ron', 'Luke', 'Joyce', 'John', 'Sarah']
    const lastNames = ['Moreno', 'Vargas', 'Cook', 'Freeman', 'Doe', 'Smith']
    const regions = ['Riyadah, Al-Malaz', 'Jeddah, Al-Hamra', 'Dammam, Al-Shati']

    const firstName = firstNames[index % firstNames.length]
    const lastName = lastNames[index % lastNames.length]

    const statuses: ('approved' | 'rejected' | 'pending')[] = ['approved', 'rejected', 'pending', 'pending']
    const status = statuses[index % statuses.length]

    return {
        id,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}_${lastName.toLowerCase()}${index}@lmc.sa`,
        phone: `+966 56 838 ${3200 + index}`,
        region: regions[index % regions.length],
        isActive: status === 'approved',
        status,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(2025, 8, 23, 10, 45).toISOString(),
        role: {
            id: '1',
            name: 'Seller'
        },
        companyName: index % 2 === 0 ? 'Urban Trend Store' : 'Elite Electronics',
        contactNumber: `234567${650 + index}`,
        commercialRegistrationNumber: `2345676${540 + index}`,
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
        documents: [
            {
                id: 'doc-1',
                type: 'commercial_register',
                title: 'Commercial Register',
                image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                fileUrl: '#'
            },
            {
                id: 'doc-2',
                type: 'tax_card',
                title: 'Tax Card',
                image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                fileUrl: '#'
            }
        ]
    }
})

export const getSellerById = (id: string): SellerItem | undefined => {
    return SELLERS_MOCK.find(s => s.id === id)
}
