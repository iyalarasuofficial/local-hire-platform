import FindWorker from "../pages/user/FindWorker";
import Mybookings from "../pages/user/Mybookings";
import UserHome from "../pages/user/UserHome";
import  ViewProfile  from "../pages/user/ViewProfile";

const userroutes = [
  {
    path: "dashboard/user",
    element: <UserHome />,
  },
  {
    path: "dashboard/user/find-worker",
    element: <FindWorker />,
  },

  {
    path: "dashboard/user/find-worker/workers/detail/:workerId",
    element: <ViewProfile/>
  },
  {
    path:"/dashboard/user/bookings",
    element:<Mybookings/>
  }
];


export default userroutes;
