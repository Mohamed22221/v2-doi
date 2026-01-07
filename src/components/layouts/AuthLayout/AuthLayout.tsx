import Simple from './Simple'
import Pages from '@/pages'
import { useAppSelector } from '@/store'
import { LAYOUT_TYPE_BLANK } from '@/constants/theme.constant'

const AuthLayout = () => {
    const layoutType = useAppSelector((state) => state.theme.layout.type)

    return (
        <div className="app-layout-blank flex flex-auto flex-col h-[100vh]">
            {layoutType === LAYOUT_TYPE_BLANK ? (
                <Pages />
            ) : (
                <Simple>
                    <Pages />
                </Simple>
            )}
        </div>
    )
}

export default AuthLayout
