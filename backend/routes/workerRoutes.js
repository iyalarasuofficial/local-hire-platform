import express from "express";
import {
  registerWorker,
  updateAvailability,
  getWorkerProfile,
  getWorkerRating,
  updateWorkerProfile,
} from "../controllers/workerController.js";

const router = express.Router();

// 📌 Register a new worker
router.post("/register", registerWorker);


// 📌 Update availability status (online/offline)
router.patch("/:uid/availability", updateAvailability);

// 📌 Get worker profile by UID
router.get("/:uid", getWorkerProfile);

// 📌 Get average rating for a worker
router.get("/:uid/rating", getWorkerRating);

// 📌 Update worker profile
router.patch("/:uid", updateWorkerProfile);

export default router;
