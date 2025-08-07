import express from "express";
import {createBooking,getWorkerBookings,updateBookingStatus,updatePaymentStatus,getBookingById,getAllBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

// 📌 Create new booking
router.post("/", createBooking);

// 📌 Get bookings by worker UID
router.get("/worker/:uid", getWorkerBookings);

// 📌 Get a single booking by booking ID
router.get("/:bookingId", getBookingById);

// 📌 Update booking status (approved, in-progress, completed, cancelled)
router.patch("/:bookingId/status", updateBookingStatus);

// 📌 Update payment status (paid)
router.patch("/:bookingId/payment", updatePaymentStatus);

// 📌 Admin: Get all bookings
router.get("/", getAllBookings);

export default router;
