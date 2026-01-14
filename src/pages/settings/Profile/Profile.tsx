import React from 'react'
import FormUpdateProfile from './components/FormUpdateProfile'


interface Props {
  data : {
    role: string
    email: string
    phone: string
  } 
}

const Profile = ({data} : Props) => {

  return (
    <div>
      <FormUpdateProfile data={data} />
    </div>
  )
}

export default Profile