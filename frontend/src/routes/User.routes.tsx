import FindWorker from "../pages/user/FindWorker";
import Mybookings from "../pages/user/Mybookings";
import UserContact from "../pages/user/UserContact";
import UserHome from "../pages/user/UserHome";
import UserProfile from "../pages/user/UserProfile";
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
  ,
  {
    path:"/user/profile",
    element:<UserProfile/>
  }
  ,
  {
    path:"dashboard/user/contact",
    element:<UserContact/>
  }
];


export default userroutes;
