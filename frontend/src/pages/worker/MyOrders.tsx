import React from 'react'
import WorkerNav from '../../components/worker/WorkerNav'
import WorkerBookings from '../../components/worker/WorkerBookings'
import Footer from '../../components/landing/Footer'

const MyOrders = () => {
  return (
  <>
  <WorkerNav/>
  <WorkerBookings/>
  <Footer panelType="worker"/>
  </>
  )
}

export default MyOrders