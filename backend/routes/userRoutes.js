import express from "express";
import {registerUser,getNearbyWorkers,updateUserProfile, getDefaultWorkers, getUser
} from "../controllers/userController.js";
import {addRating} from "../controllers/ratingController.js"
import {verifyFirebaseToken} from "../middleware/firebaseAuth.js"

import {getUserReviews} from "../controllers/ratingController.js"

const router = express.Router();

// 📌 Register new user
router.post("/register", registerUser);

// 📌 Get workers near user by location & skill
router.get("/nearby-workers", verifyFirebaseToken,getNearbyWorkers);

// 📌 Get all bookings by a specific user

router.get("/random",verifyFirebaseToken,getDefaultWorkers);
// 📌 Rate a worker
router.post("/rate", addRating);

router.get("/:uid",getUser)

router.put("/edit-profile/:uid",updateUserProfile);

router.get("/getreviews/:workerId", verifyFirebaseToken, getUserReviews);

// // 📌 Get all users (for admin)
// router.get("/all", getAllUsers);

// 📌 Update user profile
router.patch("/:uid", updateUserProfile);

export default router;
