import { AssignedAuctionItem, HallItem } from '@/api/types/halls'

export const HALL_DETAILS_MOCK: HallItem = {
    id: 'HL-003',
    name: 'Riyadh Hall | صالة الرياض',
    code: 'HL-003',
    status: 'active',
    assignedCount: 5,
    createdAt: '2026-02-05T10:00:00Z',
    parentId: null,
    translations: [
        { languageCode: 'en', name: 'Riyadh Hall', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' },
        { languageCode: 'ar', name: 'صالة الرياض', description: 'لوريم إيبسوم هو ببساطة نص شكلي يستخدم في صناعة الطباعة والتنضيد.' }
    ],
    sortOrder: 1,
    image: '/img/halls/hall-1.jpg'
}

export const ASSIGNED_AUCTIONS_MOCK: AssignedAuctionItem[] = [
    {
        id: 'LA-20031',
        itemName: 'Vintage Watch Collection',
        itemCode: '#LA-20031',
        sellerName: 'TimeHouse',
        categoryParent: 'Collectibles',
        categoryChild: 'Watches',
        status: 'live',
        startDate: '2026-02-05T18:00:00Z',
        endDate: '2026-02-10T18:00:00Z'
    },
    {
        id: 'LA-20032',
        itemName: 'Luxury Perfume Set',
        itemCode: '#LA-20032',
        sellerName: 'Elite Scents',
        categoryParent: 'Fashion',
        categoryChild: 'Shoes',
        status: 'scheduled',
        startDate: '2026-02-05T18:00:00Z',
        endDate: '2026-02-12T18:00:00Z'
    },
    {
        id: 'LA-20033',
        itemName: 'Antique Wooden Chair',
        itemCode: '#LA-20033',
        sellerName: 'Heritage Market',
        categoryParent: 'Antiques',
        categoryChild: 'Furniture',
        status: 'hidden',
        startDate: '',
        endDate: ''
    },
    {
        id: 'LA-20034',
        itemName: 'Gaming Headset RGB',
        itemCode: '#LA-20034',
        sellerName: 'ProGamers',
        categoryParent: 'Electronics',
        categoryChild: 'Accessories',
        status: 'ended',
        startDate: '2026-02-05T18:00:00Z',
        endDate: '2026-02-06T18:00:00Z'
    },
    {
        id: 'LA-20035',
        itemName: 'iPhone 14 Pro Live Auction',
        itemCode: '#LA-20035',
        sellerName: 'SmartTech Store',
        categoryParent: 'Electronics',
        categoryChild: 'Mobile Phones',
        status: 'rejected',
        startDate: '',
        endDate: ''
    }
]
