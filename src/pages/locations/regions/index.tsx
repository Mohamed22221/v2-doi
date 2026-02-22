// Components
import RegionsTable from './components/RegionsTable'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

/**
 * RegionsPage Component
 * The main view for managing Regions.
 */
const RegionsPage = () => {
    return (
        <BackgroundRounded>
            <RegionsTable />
        </BackgroundRounded>
    )
}

export default RegionsPage
