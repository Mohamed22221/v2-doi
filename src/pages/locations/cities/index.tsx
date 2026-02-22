// Components
import CitiesTable from './components/CitiesTable'
import BackgroundRounded from '@/components/shared/BackgroundRounded'

/**
 * CitiesPage Component
 * The main view for managing Cities.
 */
const CitiesPage = () => {
    return (
        <BackgroundRounded>
            <CitiesTable />
        </BackgroundRounded>
    )
}

export default CitiesPage
