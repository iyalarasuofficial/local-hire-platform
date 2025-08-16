
import WorkerNav from '../../components/worker/WorkerNav'
import Footer from '../../components/landing/Footer'
import EditWorkerProfile from '../../components/worker/EditWorkerProfile'

const workerProfile = () => {
  return (
    <>
    <WorkerNav/>
    <EditWorkerProfile/>
   <Footer panelType="worker"/>
    </>
  )
}

export default workerProfile;