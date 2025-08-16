import React from 'react'
import UserBookings from '../../components/user/UserBookings'
import UserNav from '../../components/user/UserNav'
import Footer from '../../components/landing/Footer'

const Mybookings = () => {
  return (<>
    <UserNav/>
    <UserBookings/>
  <Footer panelType="user"/>
    </>
  )
}

export default Mybookings