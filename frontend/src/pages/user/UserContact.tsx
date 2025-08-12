import React from 'react'
import ContactHero from '../../components/landing/ContactHero'
import ContactSection from '../../components/landing/ContactSection '
import UserNav from '../../components/user/UserNav'
import Footer from '../../components/landing/Footer'

const UserContact = () => {
  return (
    <>
    <UserNav/>
    <ContactHero/>
    <ContactSection/>
    <Footer/>
    </>
  )
}

export default UserContact