import express from "express";
import {createBooking,getWorkerBookings,getBookingById, getUserBookings,acceptedWork ,cancelBooking,completedWork
} from "../controllers/bookingController.js";
import { verifyFirebaseToken } from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post("/",verifyFirebaseToken, createBooking);
router.get("/user/:uid",verifyFirebaseToken,getUserBookings);
router.get("/worker/:uid",verifyFirebaseToken, getWorkerBookings);
router.patch("/common/:bookingId",verifyFirebaseToken,cancelBooking);
router.patch("/user/completed/:bookingId",verifyFirebaseToken,completedWork);
router.patch("/worker/accepted/:bookingId",verifyFirebaseToken,acceptedWork)
router.get("/:bookingId",verifyFirebaseToken, getBookingById);

export default router;
