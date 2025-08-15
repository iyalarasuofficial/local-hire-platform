
import MyOrders from "../pages/worker/MyOrders";
import WorkerContact from "../pages/worker/WorkerContact";
import WorkerHome from "../pages/worker/WorkerHome";
import WorkerProfile from "../pages/worker/workerProfile";
const worker_routes=[
    {
    path: "dashboard/worker",
    element: <WorkerHome />,
  },
  {
    path:"dashboard/worker/contact",
    element:<WorkerContact/>
  }
  ,{
    path:"dashboard/worker/work-orders",
    element:<MyOrders/>
  },
  {
    path:"worker/profile",
    element:<WorkerProfile/>
  }
]

export default worker_routes;