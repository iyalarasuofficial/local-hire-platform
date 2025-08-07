import express from "express";
import { getAllWorkers, updateWorkerApproval, updateUserSuspension,getAllUsers} from "../controllers/adminController.js";
import { getAllBookings } from "../controllers/bookingController.js";
const router = express.Router();

// 🔹 Get all workers
router.get("/workers", getAllWorkers);

// 🔹 Block / Unblock a worker
router.patch("/workers/:workerId/block", updateWorkerApproval);

// 🔹 Suspend / Unsuspend a user
router.patch("/users/:userId/suspend", updateUserSuspension);

router.get("/users", getAllUsers);

// 🔹 Get all bookings
router.get("/bookings", getAllBookings);

export default router;
