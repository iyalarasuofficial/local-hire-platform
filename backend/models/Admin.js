import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  role: { type: String, default: 'admin' },
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
