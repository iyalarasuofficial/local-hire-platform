import Register from "../../components/auth/Register";
import Login from "../../components/auth/Login";
import Footer from "../../components/landing/Footer";
import HowItWork from "../../components/landing/HowItWork";
import LandHero from "../../components/landing/LandHero";
import LandNav from "../../components/landing/LandNav";
import OurMission from "../../components/landing/OurMission";
import Testimonials from "../../components/landing/Testimonials";
import WhyChooseUs from "../../components/landing/WhyChooseUs";





const Home = () => {

  return (
    <>

    <LandNav/>
    <LandHero/>
    <HowItWork/>
    <OurMission/>
    <WhyChooseUs/>
    <Testimonials/>
    <Footer/>
    
    </>


  );
};

export default Home;
