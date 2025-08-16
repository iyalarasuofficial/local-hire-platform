import express from "express";
import {registerUser,getNearbyWorkers,updateUserProfile, getDefaultWorkers, getUser
} from "../controllers/userController.js";
import {addRating} from "../controllers/ratingController.js"
import {verifyFirebaseToken} from "../middleware/firebaseAuth.js"

import {getUserReviews} from "../controllers/ratingController.js"

const router = express.Router();

router.post("/register", registerUser);
router.get("/nearby-workers", verifyFirebaseToken,getNearbyWorkers);
router.get("/random",verifyFirebaseToken,getDefaultWorkers);
router.post("/rate",verifyFirebaseToken, addRating);
router.put("/edit-profile/:uid",updateUserProfile);
router.get("/getreviews/:workerId", verifyFirebaseToken, getUserReviews);
router.get("/:uid",getUser);


export default router;
