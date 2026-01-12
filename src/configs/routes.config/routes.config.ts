import { lazy } from 'react'
import authRoute from './authRoute'

import type { Routes } from '@/@types/routes'
import SettingsHeader from '@/pages/settings/components/SettingsHeader'
// Merge public and protected routes
export const publicRoutes: Routes = [...authRoute]
// Protected routes
export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/pages/Home')),
        authority: [],
    },
    {
        key: 'users',
        path: '/users',
        component: lazy(() => import('@/pages/users')),
        authority: [],
    },
    {
        key: 'categories',
        path: '/categories',
        component: lazy(() => import('@/pages/categories')),
        authority: [],
    },
    {
        key: 'orders',
        path: '/orders',
        component: lazy(() => import('@/pages/orders')),
        authority: [],
    },
    {
        key: 'fixedPrice',
        path: '/fixed-price',
        component: lazy(() => import('@/pages/fixed-price')),
        authority: [],
    },
    {
        key: 'collapseMenu_item1',
        path: '/live-auctions',
        component: lazy(() => import('@/pages/live-auctions')),
        authority: [],
    },
    {
        key: 'collapseMenu_item2',
        path: '/duration-auctions',
        component: lazy(() => import('@/pages/duration-auctions')),
        authority: [],
    },
    {
        key: 'manageAds',
        path: '/manage-ads',
        component: lazy(() => import('@/pages/manage-ads')),
        authority: [],
    },
    {
        key: 'payments',
        path: '/payments',
        component: lazy(() => import('@/pages/payments')),
        authority: [],
    },
    {
        key: 'support',
        path: '/support',
        component: lazy(() => import('@/pages/support')),
        authority: [],
    },

        {
        key: 'settings',
        path: `/settings/:tab`,
        component: lazy(() => import('@/pages/settings')),
        meta: {
            header: SettingsHeader,
            headerContainer: true,
        },
    },


    /** Example purpose only, please remove */
]
