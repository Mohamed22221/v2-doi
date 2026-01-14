import appConfig from '@/configs/app.config'
import { useNavigate } from 'react-router-dom'
import { ACCESS_TOKEN } from '@/api/constants/api.constant'
import Cookies from 'js-cookie'

function useAuth() {
    const navigate = useNavigate()

    const tokenData = Cookies.get(ACCESS_TOKEN)

    const signOut = () => {
        Cookies.remove(ACCESS_TOKEN)
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    return {
        authenticated: !!tokenData,
        signOut,
    }
}

export default useAuth
