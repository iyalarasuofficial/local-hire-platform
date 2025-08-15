import React from 'react'
import WorkerNav from '../../components/worker/WorkerNav'
import Footer from '../../components/landing/Footer'
import EditWorkerProfile from '../../components/worker/EditWorkerProfile'

const workerProfile = () => {
  return (
    <>
    <WorkerNav/>
    <EditWorkerProfile/>
    <Footer/>
    </>
  )
}

export default workerProfile;