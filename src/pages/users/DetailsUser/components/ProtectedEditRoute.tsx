import { ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'

type ProtectedProps = {
    deletedAt: null | string
    children: ReactNode
}
const ProtectedEditRoute = ({ deletedAt, children }: ProtectedProps) => {
    const { id } = useParams()

    if (deletedAt != null) {
        return <Navigate replace to={`${id ? `/users/${id}` : '/users/'}`}  />
    }

    return children
}

export default ProtectedEditRoute
