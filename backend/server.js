import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import workerRoutes from "./routes/workerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "../backend/routes/authRoutes.js"
import contactRoutes from "../backend/routes/contactRoutes.js"

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth",authRoutes)
app.use("/api/contact",contactRoutes)
const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log("server running on",PORT);
})