import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' },
  message: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' },
  actionTaken: { type: String },
}, { timestamps: true });

export default mongoose.model("Complaint", complaintSchema);
