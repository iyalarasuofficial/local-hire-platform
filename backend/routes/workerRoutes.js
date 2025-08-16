import express from "express";
import {
  registerWorker,
  getWorkerProfile,
  updateWorkerProfile,
} from "../controllers/workerController.js";
import  {verifyFirebaseToken} from "../middleware/firebaseAuth.js"
const router = express.Router();

router.post("/register",registerWorker);

router.get("/:uid",verifyFirebaseToken ,getWorkerProfile);


router.put("/edit-profile/:uid",verifyFirebaseToken,updateWorkerProfile);

export default router;
