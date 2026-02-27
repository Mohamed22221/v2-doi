import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SLICE_BASE_NAME } from './constants'

export interface SessionState {
    signedIn: boolean
    accessToken: string | null
    refreshToken: string | null
    otpCode: string | null
    otpSessionId: string | null
    forgotPhone: string | null
}

const initialState: SessionState = {
    signedIn: false,
    accessToken: null,
    refreshToken: null,
    otpCode: null,
    otpSessionId: null,
    forgotPhone: null,
}

const sessionSlice = createSlice({
    name: `${SLICE_BASE_NAME}/session`,
    initialState,
    reducers: {
        signInSuccess(
            state,
            action: PayloadAction<{
                accessToken: string
                refreshToken: string
            }>,
        ) {
            state.signedIn = true
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.otpCode = null
            state.otpSessionId = null
            state.forgotPhone = null
        },
        signOutSuccess(state) {
            state.signedIn = false
            state.accessToken = null
            state.refreshToken = null
            state.otpCode = null
            state.otpSessionId = null
            state.forgotPhone = null
        },
        tokenUpdated(
            state,
            action: PayloadAction<{
                accessToken: string
                refreshToken?: string
            }>,
        ) {
            state.accessToken = action.payload.accessToken
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken
            }
        },
        setOtpData(
            state,
            action: PayloadAction<{
                otpCode?: string
                otpSessionId?: string
                forgotPhone?: string
            }>,
        ) {
            if (action.payload.otpCode !== undefined) {
                state.otpCode = action.payload.otpCode
            }
            if (action.payload.otpSessionId !== undefined) {
                state.otpSessionId = action.payload.otpSessionId
            }
            if (action.payload.forgotPhone !== undefined) {
                state.forgotPhone = action.payload.forgotPhone
            }
        },
        clearOtpData(state) {
            state.otpCode = null
            state.otpSessionId = null
            state.forgotPhone = null
        },
    },
})

export const {
    signInSuccess,
    signOutSuccess,
    tokenUpdated,
    setOtpData,
    clearOtpData,
} = sessionSlice.actions
export default sessionSlice.reducer
