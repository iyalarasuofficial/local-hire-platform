import React from 'react'
import UserNav from '../../components/user/UserNav'
import WorkerSearchPage from '../../components/user/WorkerSearch'
import WorkerSearch from '../../components/user/WorkerSearch'
import LandHero from '../../components/landing/LandHero'
import Footer from "../../components/landing/Footer";
import HowItWork from "../../components/landing/HowItWork";
import OurMission from "../../components/landing/OurMission";
import Testimonials from "../../components/landing/Testimonials";
import WhyChooseUs from "../../components/landing/WhyChooseUs";


const UserHome = () => {
  return (<>
    <UserNav/>
    <LandHero pannel="user" />
    <HowItWork/>
    <OurMission/>
    <WhyChooseUs/>
    <Testimonials/>
   <Footer panelType="user"/>
    </>
  )
}

export default UserHome