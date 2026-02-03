import Header from '@/components/template/Header'
import SidePanel from '@/components/template/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import Pages from '@/pages'
import Notification from '../template/Notification'
import LanguageSelector from '../template/LanguageSelector'

const HeaderActionsStart = () => {
    return (
        <>
            <MobileNav />
            <SideNavToggle />
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <>
            <LanguageSelector />
            <Notification />
            <SidePanel />
            <UserDropdown hoverable={false} />
        </>
    )
}

const ModernLayout = () => {
    return (
        <div className="app-layout-modern flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-primary-50 dark:bg-primary-800 border-l border-gray-200 dark:border-gray-700">
                    <Header
                        className="border-b border-gray-200 dark:border-gray-700"
                        headerEnd={<HeaderActionsEnd />}
                        headerStart={<HeaderActionsStart />}
                    />

                    <Pages />

                </div>
            </div>
        </div>
    )
}

export default ModernLayout
