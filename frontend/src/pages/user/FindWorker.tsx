import React from 'react'
import WorkerSearch from '../../components/user/WorkerSearch'
import UserNav from '../../components/user/UserNav'
import Footer from '../../components/landing/Footer'

const FindWorker = () => {
  return (
<>
<UserNav/>
<WorkerSearch/>
 <Footer panelType="user"/>
</>
  )
}

export default FindWorker