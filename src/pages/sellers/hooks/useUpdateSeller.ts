import { useMutation, useQueryClient } from '@tanstack/react-query'
import { SELLERS_MOCK, SellerItem } from '../data/sellers.mock'

// Type for seller update payload
export type TSellerPayload = {
    firstName: string
    lastName: string
    email: string
    phone: string
    password?: string
    isActive: boolean
    image?: string | null
    businessName?: string | null
    businessPhone?: string | null
    commercialRegistrationNumber?: string | null
}

// Mock update function
const updateSellerMock = async (id: string, data: TSellerPayload): Promise<SellerItem> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const sellerIndex = SELLERS_MOCK.findIndex(s => s.id === id)
            if (sellerIndex === -1) {
                reject(new Error('Seller not found'))
                return
            }

            // Update the mock data
            const existingSeller = SELLERS_MOCK[sellerIndex]
            const updatedSeller: SellerItem = {
                ...existingSeller,
                user: {
                    ...existingSeller.user,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    isActive: data.isActive,
                    image: data.image || undefined,
                    updatedAt: new Date().toISOString(),
                },
                businessName: data.businessName || null,
                businessPhone: data.businessPhone || null,
                commercialRegistrationNumber: data.commercialRegistrationNumber || null,
            }

            SELLERS_MOCK[sellerIndex] = updatedSeller
            resolve(updatedSeller)
        }, 500)
    })
}

export const useUpdateSeller = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TSellerPayload }) =>
            updateSellerMock(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sellers'] })
            queryClient.invalidateQueries({ queryKey: ['seller-details'] })
        },
    })
}
