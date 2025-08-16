import React from 'react'
import EditProfile from '../../components/user/EditProfile'
import UserNav from '../../components/user/UserNav'
import Footer from '../../components/landing/Footer'

const UserProfile = () => {
  return (
 <>
 <UserNav/>
 <EditProfile/>
  <Footer panelType="user"/>
 </>
  )
}

export default UserProfile