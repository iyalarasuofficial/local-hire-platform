import express from "express";
import {
  getAllComplaints,
  resolveComplaint,
} from "../controllers/complaintController.js";

const router = express.Router();

// 📌 GET all complaints (admin side)
router.get("/", getAllComplaints);

// 📌 PATCH to resolve complaint (admin side)
router.patch("/:complaintId/resolve", resolveComplaint);

export default router;
