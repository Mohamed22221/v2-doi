import { useGetUserDetails } from '@/api/hooks/users'
import { lazy, Suspense } from 'react'

import UserInfoSkeleton from '@/components/skeleton/UserInfoSkeleton'
import { useParams } from 'react-router-dom'

const UserInfo = lazy(() => import('./components/UserInfo'))
const DetailsUserPage = () => {
    
    const { id } = useParams()
    const { data , isError , isLoading } = useGetUserDetails(id!)

    if (isError) {
        return (
        <div>
            <p>isError</p>
        </div>
        )

    }
    return (
        <div>
            <Suspense fallback={<UserInfoSkeleton />}>
               {isLoading ? <UserInfoSkeleton /> : <UserInfo data={data?.data} />}  
            </Suspense>
        </div>
    )
}

export default DetailsUserPage
