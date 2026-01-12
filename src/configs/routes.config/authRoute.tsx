import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const authRoute: Routes = [
    {
        key: 'signIn',
        path: `/sign-in`,
        component: lazy(() => import('@/pages/auth/SignIn')),
        authority: [],
    },
    {
        key: 'forgotPassword',
        path: `/forgot-password`,
        component: lazy(() => import('@/pages/auth/ForgotPassword')),
        authority: [],
    },
    {
        key: 'resetPassword',
        path: `/reset-password`,
        component: lazy(() => import('@/pages/auth/ResetPassword')),
        authority: [],
    },
    {
        key: 'verifyOtp',
        path: `/verify-otp`,
        component: lazy(() => import('@/pages/auth/VerifyOtp')),
        authority: [],
    },
    {
        key: 'newPassword',
        path: `/new-password`,
        component: lazy(() => import('@/pages/auth/NewPassword')),
        authority: [],
    }
]

export default authRoute
