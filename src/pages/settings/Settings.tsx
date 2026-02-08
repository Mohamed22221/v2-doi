import { lazy, Suspense, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
// Components
import Tabs from '@/components/ui/Tabs'
import { useGetProfile } from '@/api/hooks/auth'
import { Loading } from '@/components/shared'
import BackgroundRounded from '@/components/shared/BackgroundRounded'
import ErrorState from '@/components/shared/ErrorState'
// Lazy load settings tabs
const Profile = lazy(() => import('./Profile'))
const Password = lazy(() => import('./Password'))

// Tabs structure
const { TabNav, TabList } = Tabs
// setting component

const LoadingComponent = () => {
    return (
        <div className="flex flex-auto flex-col h-[40vh]">
            <Loading loading={true} />
        </div>
    )
}

const Settings = () => {
    const { t } = useTranslation()
    const [currentTab, setCurrentTab] = useState('profile')
    const navigate = useNavigate()
    const location = useLocation()

    const settingsMenu: Record<
        string,
        {
            label: string
            path: string
        }
    > = {
        profile: { label: t('settings.tabs.profile'), path: 'profile' },
        password: { label: t('settings.tabs.password'), path: 'password' },
    }

    const onTabChange = (val: string) => {
        setCurrentTab(val)
        navigate(`/settings/${val}`)
    }

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1,
    )
    useEffect(() => {
        setCurrentTab(path)
    }, [path])
    // Render data profile
    const { data, isError, error, isLoading } = useGetProfile()
    const dataProfile = data?.data
    if (isError) {
        return (
            <div>
                <ErrorState message={error?.message} fullPage={true} />
            </div>
        )
    }
    return (
        <BackgroundRounded>
            <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
                <TabList>
                    {Object.keys(settingsMenu).map((key) => (
                        <TabNav key={key} value={key}>
                            {settingsMenu[key].label}
                        </TabNav>
                    ))}
                </TabList>
            </Tabs>

            <div className="px-4 py-6">
                {isLoading ? (
                    <LoadingComponent />
                ) : (
                    <>
                        <Suspense fallback={LoadingComponent()}>
                            {currentTab === 'profile' && dataProfile && (
                                <Profile data={dataProfile} />
                            )}
                        </Suspense>
                        <Suspense fallback={LoadingComponent()}>
                            {currentTab === 'password' && <Password />}
                        </Suspense>
                    </>
                )}
            </div>
        </BackgroundRounded>
    )
}

export default Settings
