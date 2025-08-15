import React from 'react'
import ContactHero from '../../components/landing/ContactHero'
import ContactSection from '../../components/landing/ContactSection '
import Footer from '../../components/landing/Footer'
import WorkerNav from '../../components/worker/WorkerNav'
const WorkerContact = () => {

    return (
        <>
            <WorkerNav />
            <ContactHero />
            <ContactSection />
            <Footer />
        </>
    )

}
export default WorkerContact;