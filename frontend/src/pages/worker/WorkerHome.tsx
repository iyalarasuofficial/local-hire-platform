import React from 'react'
import WorkerNav from '../../components/worker/WorkerNav'
import LandHero from '../../components/landing/LandHero'
import Footer from "../../components/landing/Footer";
import HowItWork from "../../components/landing/HowItWork";
import OurMission from "../../components/landing/OurMission";
import Testimonials from "../../components/landing/Testimonials";
import WhyChooseUs from "../../components/landing/WhyChooseUs";
import WorkerPanelHero from '../../components/worker/WorkerPanelHero';

const WorkerHome = () => {
  return (
    <>
    <WorkerNav/>
    <WorkerPanelHero/>
    <HowItWork/>
    <OurMission/>
    <WhyChooseUs/>
    <Testimonials/>
  <Footer panelType="worker"/>
    </>
  )
}

export default WorkerHome