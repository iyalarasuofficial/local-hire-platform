import express from "express";
import { raiseComplaint } from "../controllers/complaintController.js";

const router = express.Router();

// 📌 POST a new complaint (user side)
router.post("/", raiseComplaint);

export default router;
