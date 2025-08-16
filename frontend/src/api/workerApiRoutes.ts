const WorkerApiRoutes = {

  WORKER_BOOKINGS:{path:"/api/bookings/worker",authenticate:true},
  CANCEL_BOOKING:{path:"api/bookings/common",authenticate:true},
  ACCEPT_BOOKING:{path:"api/bookings/worker/accepted",authenticate:true},

  GET_WORKER_PROFILE:{path:"api/workers",authenticate:true},

  UPDATE_WORKER_PROFILE:{path:"api/workers/edit-profile",authenticate:true},


};

export default WorkerApiRoutes;
