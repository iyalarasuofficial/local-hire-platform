import AboutHero from "../../components/landing/AboutHero";
import LandNav from "../../components/landing/LandNav";
import OurMission from "../../components/landing/OurMission";
import TeamSection from "../../components/landing/TeamSection";
import Footer from "../../components/landing/Footer";
import ContactHero from "../../components/landing/ContactHero";
import ContactSection from "../../components/landing/ContactSection ";


export default function About() {
    return (
        <>
            <LandNav />
            <AboutHero />
            <OurMission/>
            <TeamSection/>
            <Footer/>

        </>
    );
}
