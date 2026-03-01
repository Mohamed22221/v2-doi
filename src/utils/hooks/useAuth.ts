import { useAppSelector } from '@/store'
import { useLogout } from '@/api/hooks/auth'

function useAuth() {
    const accessToken = useAppSelector((state) => state.auth.session.accessToken)
    const { logout } = useLogout()

    const signOut = async () => {
        await logout()
    }

    return {
        authenticated: !!accessToken,
        signOut,
    }
}

export default useAuth
