import { UserItem } from '@/api/types/users'

export const SELLERS_MOCK: any[] = Array.from({ length: 1250 }).map((_, index) => {
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
        }
    }
})

export const getSellerById = (id: string): UserItem | undefined => {
    return SELLERS_MOCK.find(s => s.id === id)
}
