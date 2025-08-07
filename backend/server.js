import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import adminComplaintRoutes from "./routes/adminComplaintRoutes.js"
import authRoutes from "../backend/routes/authRoutes.js"


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/complaints", complaintRoutes); 
app.use("/api/admin/complaints", adminComplaintRoutes); 
app.use("/api/auth",authRoutes)
const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log("server running on",PORT);
})