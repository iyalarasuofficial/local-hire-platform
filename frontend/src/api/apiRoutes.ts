// src/api/apiRoutes.ts
const ApiRoutes = {
  LOGIN: { path: "/api/auth/check", authenticate: false },
  USER_SIGNUP: { path: "/api/users/register", authenticate: false },
  WORKER_SIGNUP: { path: "/api/workers/register", authenticate: false },
  GET_PROFILE: { path: "/api/auth/check", authenticate: true },
  NEARBY_WORKERS: { path: "/api/users/nearby-workers", authenticate: true },
  RANDOM_WORKERS:{path:"/api/users/random",authenticate:true},
  GETALL_REVIEWS:{path:"/api/users/getreviews",authenticate:true},
  WORKER_BOOK:{path:"/api/bookings",authenticate:true},

  USER_BOOKING:{path:"/api/bookings/user",authenticate:true},

  CANCEL_BOOKING:{path:"api/bookings/user",authenticate:true},

  WRITE_REVIEW:{path:"api/users/rate",authenticate:true},

  GET_USER_PROFILE:{path:"api/users",authenticate:true},

  UPDATE_USER_PROFILE:{path:"api/users/edit-profile",authenticate:true},
};

export default ApiRoutes;
