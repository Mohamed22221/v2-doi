import { LanguageCode } from './common'

export type HallStatus = 'active' | 'achieved' | 'hidden'

export interface HallTranslation {
    languageCode: LanguageCode;
    name: string;
    description?: string;
}

export interface HallItem {
    id: string
    name: string // This will be the name in current UI language
    code: string
    status: HallStatus
    assignedCount: number
    createdAt: string
    parentId: string | null
    parent?: HallItem | null
    children?: HallItem[]
    translations: HallTranslation[]
    sortOrder: number
    image: string | null
}

export interface HallPayload {
    translations: HallTranslation[]
    parentId?: string | null
    status: HallStatus
    sortOrder: number
    image?: string | null
    code: string
}

export interface AssignedAuctionItem {
    id: string
    itemName: string
    itemCode: string
    sellerName: string
    categoryParent: string
    categoryChild: string
    status: 'live' | 'scheduled' | 'hidden' | 'ended' | 'rejected'
    startDate: string
    endDate: string
}

export interface AssignableAuction {
    id: string
    title: string
    auctionCode: string
    sellerName: string
    status: string
    category: string
    date?: string
    startingBid: number
    currency: string
    imageUrl: string
}
