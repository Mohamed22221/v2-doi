import React from 'react'
import FormUpdateProfile from './components/FormUpdateProfile'
import { useGetProfile } from '@/api/hooks/auth'

const Profile = () => {
      const { data } = useGetProfile()
      const dataProfile = data?.data
  return (
    <div>
      <FormUpdateProfile data={dataProfile} />
    </div>
  )
}

export default Profile