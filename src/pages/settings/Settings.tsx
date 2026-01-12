import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
// Components
import Container from '@/components/shared/Container'
import Tabs from '@/components/ui/Tabs'
import AdaptableCard from '@/components/shared/AdaptableCard'
// Lazy load settings tabs
const Profile = lazy(() => import('./Profile'))
const Password = lazy(() => import('./Password'))

// Tabs structure
const { TabNav, TabList } = Tabs
const settingsMenu: Record<
    string,
    {
        label: string
        path: string
    }
> = {
    profile: { label: 'Profile', path: 'profile' },
    password: { label: 'Password', path: 'password' },
}
// setting component
const Settings = () => {
  const [currentTab, setCurrentTab] = useState('profile')
  const navigate = useNavigate()
  const location = useLocation()

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
  return (
    <Container>


      <AdaptableCard>
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
          <Suspense fallback={<></>}>
            {currentTab === 'profile' && <Profile />}
            {currentTab === 'password' && <Password />}
          </Suspense>
        </div>
      </AdaptableCard>
    </Container>
  )
}

export default Settings
