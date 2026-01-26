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
        key: 'users',
        path: `/users/:id`,
        component: lazy(() => import('@/pages/users/DetailsUser')),
    },
    {
        key: 'users',
        path: `/users/:id/edit`,
        component: lazy(() => import('@/pages/users/UpdateUser')),
    },
    {
        key: 'categories',
        path: '/categories',
        component: lazy(() => import('@/pages/categories')),
        authority: [],
    },
    {
        key: 'brands',
        path: '/brands',
        component: lazy(() => import('@/pages/brands')),
        authority: [],
    },
    {
        key: 'brands',
        path: '/brands/create',
        component: lazy(() => import('@/pages/brands/ActionBrand/CreateBrand')),
        authority: [],
    },
    {
        key: 'brands',
        path: '/brands/:id/edit',
        component: lazy(() => import('@/pages/brands/ActionBrand/UpdateBrand')),
    },
    {
        key: 'models',
        path: '/models',
        component: lazy(() => import('@/pages/models')),
        authority: [],
    },
    {
        key: 'models',
        path: '/models/create',
        component: lazy(() => import('@/pages/models/ActionModel/CreateModel')),
        authority: [],
    },
    {
        key: 'models',
        path: '/models/:id/edit',
        component: lazy(() => import('@/pages/models/ActionModel/UpdateModel')),
    },
    {
        key: 'categories',
        path: '/categories/create',
        component: lazy(() => import('@/pages/categories/ActionCategory/CreateCategory')),
        authority: [],
    },
    {
        key: 'categories',
        path: '/categories/:id/edit',
        component: lazy(() => import('@/pages/categories/ActionCategory/UpdateCategory')),
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
        key: 'live-auctions',
        path: '/live-auctions',
        component: lazy(() => import('@/pages/live-auctions')),
        authority: [],
    },
    {
        key: 'duration-auctions',
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
        key: 'languages',
        path: '/languages',
        component: lazy(() => import('@/pages/languages')),
        authority: [],
    },
    {
        key: 'languages',
        path: '/languages/create',
        component: lazy(() => import('@/pages/languages/ActionLanguage/CreateLanguage')),
        authority: [],
    },
    {
        key: 'languages',
        path: '/languages/:id/edit',
        component: lazy(() => import('@/pages/languages/ActionLanguage/UpdateLanguage')),
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
