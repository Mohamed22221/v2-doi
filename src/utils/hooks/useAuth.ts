import appConfig from '@/configs/app.config'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/store'
import { signOutSuccess } from '@/store/slices/auth'

function useAuth() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const accessToken = useAppSelector((state) => state.auth.session.accessToken)

    const signOut = () => {
        dispatch(signOutSuccess())
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    return {
        authenticated: !!accessToken,
        signOut,
    }
}

export default useAuth
