const WorkerApiRoutes = {

  WORKER_BOOKINGS:{path:"/api/bookings/worker",authenticate:true},
  CANCEL_BOOKING:{path:"api/bookings/common",authenticate:true},
  ACCEPT_BOOKING:{path:"api/bookings/worker/accepted",authenticate:true},

  GET_WORKER_PROFILE:{path:"api/workers",authenticate:true},


  UPDATE_WORKER_PROFILE:{path:"api/workers/edit-profile",authenticate:true},

  
  // LOGIN: { path: "/api/auth/check", authenticate: false },
  // GET_PROFILE: { path: "/api/auth/check", authenticate: true },
  // WORKER_BOOKINGS: { path: "/api/bookings/worker", authenticate: true },
  // UPDATE_PROFILE: { path: "/api/workers/edit-profile", authenticate: true },
  // GET_MY_REVIEWS: { path: "/api/workers/reviews", authenticate: true },
  // ACCEPT_BOOKING: { path: "/api/bookings/accept", authenticate: true },
  // REJECT_BOOKING: { path: "/api/bookings/reject", authenticate: true },
};

export default WorkerApiRoutes;
