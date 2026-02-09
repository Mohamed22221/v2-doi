import { HallItem } from '@/api/types/halls'

export const HALLS_ITEMS_MOCK: HallItem[] = [
    {
        id: '1',
        name: 'The Arena Hall',
        code: 'ARENA-001',
        status: 'active',
        assignedCount: 15,
        createdAt: '2024-03-20T10:30:00Z',
        parentId: null,
        translations: [
            { languageCode: 'en', name: 'The Arena Hall', description: 'Main arena for big events' },
            { languageCode: 'ar', name: 'قاعة الأرينا', description: 'القاعة الرئيسية للفعاليات الكبرى' }
        ],
        sortOrder: 1,
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000'
    },
    {
        id: '2',
        name: 'VIP Lounge',
        code: 'VIP-002',
        status: 'active',
        assignedCount: 5,
        createdAt: '2024-03-21T14:20:00Z',
        parentId: null,
        translations: [
            { languageCode: 'en', name: 'VIP Lounge', description: 'Exclusive lounge for VIPs' },
            { languageCode: 'ar', name: 'صالة كبار الشخصيات', description: 'صالة حصرية لكبار الشخصيات' }
        ],
        sortOrder: 2,
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000'
    },
    {
        id: '3',
        name: 'Meeting Room A',
        code: 'MEET-A',
        status: 'achieved',
        assignedCount: 0,
        createdAt: '2024-01-15T09:00:00Z',
        parentId: null,
        translations: [
            { languageCode: 'en', name: 'Meeting Room A', description: 'Small meeting room' },
            { languageCode: 'ar', name: 'غرفة اجتماعات أ', description: 'غرفة اجتماعات صغيرة' }
        ],
        sortOrder: 3,
        image: null
    },
    {
        id: '4',
        name: 'Grand Ballroom',
        code: 'GB-004',
        status: 'hidden',
        assignedCount: 0,
        createdAt: '2024-03-25T11:45:00Z',
        parentId: null,
        translations: [
            { languageCode: 'en', name: 'Grand Ballroom', description: 'Large ballroom' },
            { languageCode: 'ar', name: 'قاعة المناسبات الكبرى', description: 'قاعة مناسبات كبيرة' }
        ],
        sortOrder: 4,
        image: null
    }
]

// Generate more data for testing pagination
for (let i = 5; i <= 1250; i++) {
    HALLS_ITEMS_MOCK.push({
        id: i.toString(),
        name: `Hall ${i}`,
        code: `CODE-${i.toString().padStart(3, '0')}`,
        status: i % 3 === 0 ? 'active' : (i % 3 === 1 ? 'achieved' : 'hidden'),
        assignedCount: Math.floor(Math.random() * 50),
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        parentId: null,
        translations: [
            { languageCode: 'en', name: `Hall ${i}`, description: `Description for Hall ${i}` },
            { languageCode: 'ar', name: `قاعة ${i}`, description: `وصف القاعة ${i}` }
        ],
        sortOrder: i,
        image: null
    })
}
