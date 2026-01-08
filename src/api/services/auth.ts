import { TAPIResponse } from '../types/api'
import { SignInCredential, SignInResponse } from '../types/auth'
import api from '../api'

const AuthServices = {
    signIn: (
        payload: SignInCredential,
    ): Promise<TAPIResponse<SignInResponse>> => {
        return api.post('/auth/login', payload)
    },
    refreshToken: () => api.post('/refresh-token'),
}

export default AuthServices
